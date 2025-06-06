const { Account } = require('../models/accountSchema');
const { User } = require('../models/userSchema');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const mongoose = require('mongoose');

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

exports.signUp = async (req, res) => {
  try {
    const { data, error } = signupBody.safeParse(req.body);

    if (error) {
      return res.status(411).json({
        msg: "Invalid credentials",
      });
    }

    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.status(411).json({
        msg: "User already exists",
      });
    }

    const user = await User.create({
      username: data.username,
      password: data.password,
      firstName: data.firstName, // Corrected property name
      lastName: data.lastName, // Corrected property name
    });

    const userId = user._id;

    userBankAccount = await Account.create({
      userId,
      balance: Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000,
    });

    const token = jwt.sign(
      {
        userId,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      msg: "User Created",
      token: token,
      userId: userId,
      firstName: user.firstName,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
}
