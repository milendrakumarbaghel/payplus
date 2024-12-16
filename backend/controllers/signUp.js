const { Account } = require('../models/accountSchema');
const { User } = require('../models/userSchema');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/config');

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    middleName: zod.string(),
    lastName: zod.string(),
})

exports.signUp = async (req, res) => {
    try {
        const body = req.body;
        const { success } = signupSchema.safeParse(body);

        if (!success) {
            return res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            });
        }

        const existingUser = await User.findOne({
            username: body.username,
        });

        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            });
        }

        const user = await User.create({
            username: body.username,
            password: body.password,
            firstName: body.firstName,
            middleName: body.middleName,
            lastName: body.lastName
        });
        const userId = user._id;

        // Create new account
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        });

        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            message: "User created successfully",
            token: token
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
