const { prisma } = require('../prismaClient');
const zod = require('zod');
const bcrypt = require('bcrypt');

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

    const userCheck = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!userCheck) {
      return res.status(403).json({ msg: "Invalid credential" });
    }
    if (data.password) {
      let ok = false;
      try {
        ok = await bcrypt.compare(data.password, userCheck.password);
      } catch (_) {
        ok = false;
      }
      if (!ok) {
        // legacy fallback
        if (userCheck.password !== data.password) {
          return res.status(403).json({ msg: "Password is wrong" });
        }
      }
    }

    await prisma.user.update({ where: { id: req.userId }, data: payLoad });
    return res.status(200).json({ msg: "Updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
