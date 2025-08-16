const { prisma } = require('../prismaClient');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

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

    const existingUser = await prisma.user.findUnique({
      where: { username: req.body.username }
    });

    if (existingUser) {
      return res.status(411).json({
        msg: "User already exists",
      });
    }

    const initialBalance = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          username: data.username,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
      await tx.account.create({
        data: {
          userId: createdUser.id,
          balance: initialBalance,
        },
      });
      return createdUser;
    });

    const userId = user.id;

    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
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
