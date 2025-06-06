const { Account } = require('../models/accountSchema');
const { User } = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const zod = require('zod');
const mongoose = require('mongoose');

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})


exports.updateUser = async (req, res) => {
  try {
    const { data, error } = updateBody.safeParse(req.body.payload);

    const payLoad = {};
    if (data.firstName) {
      payLoad.firstName = data.firstName;
    }

    if (data.lastName) {
      payLoad.lastName = data.lastName;
    }

    if (error) {
      return res.status(403).json({ msg: "Invalid credential" });
    }

    const userCheck = await User.findById(req.userId);
    if (!userCheck) {
      return res.status(403).json({ msg: "Invalid credential" });
    }
    if (userCheck.password !== data.password) {
      console.log(
        "userCheck.password--",
        userCheck.password,
        "data.password---",
        data.password
      );
      return res.status(403).json({ msg: "Password is wrong" });
    }

    await User.updateOne({ _id: req.userId }, { $set: payLoad });
    return res.status(200).json({ msg: "Updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
