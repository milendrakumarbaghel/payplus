const { prisma } = require('../prismaClient');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const zod = require('zod');

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string()
})


exports.signIn = async (req, res) => {
  try {
    const { data, error } = signinBody.safeParse(req.body);

    if (error) {
      return res.status(411).json({
        message: "Email already taken / Incorrect inputs",
      });
    }
    const user = await prisma.user.findFirst({
      where: { username: data.username, password: data.password }
    });

    if (!user) {
      return res.status(411).json({
        message: "Error while logging in",
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET
    );

    return res.status(200).json({
      token: token,
      msg: "User logedin",
      firstName: user.firstName,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
