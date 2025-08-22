const { prisma } = require('../prismaClient');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const zod = require('zod');
const bcrypt = require('bcrypt');

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
    const user = await prisma.user.findUnique({
      where: { username: data.username }
    });

    if (!user) {
      return res.status(411).json({
        message: "Error while logging in",
      });
    }

    // Compare bcrypt hash; if hash is legacy/plaintext, allow direct match as a fallback
    let isValid = false;
    try {
      isValid = await bcrypt.compare(data.password, user.password);
    } catch (e) {
      isValid = false;
    }
    if (!isValid) {
      // Legacy fallback: if stored password equals provided (from older accounts)
      if (user.password === data.password) {
        isValid = true;
        // Optionally rehash on login for legacy users
        try {
          const newHash = await bcrypt.hash(data.password, 10);
          await prisma.user.update({ where: { id: user.id }, data: { password: newHash } });
        } catch (_) { }
      }
    }

    if (!isValid) {
      return res.status(411).json({ message: "Error while logging in" });
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
