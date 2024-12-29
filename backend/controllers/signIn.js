const { Account } = require('../models/accountSchema');
const { User } = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/config');
const zod = require('zod');
const { router } = require('../routes/user');
const mongoose = require('mongoose');

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})


exports.signIn = async (req, res) => {
    const body = req.body;
    const {success} = signinSchema.safeParse(req.body);
    if(!success) {
        return req.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: body.username,
        password: body.password
    })

    if(user) {
        const token = jwt.sign({
            userId: user._id,
        }, JWT_SECRET);

        res.json({
            message: "signed in successfull",
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
}
