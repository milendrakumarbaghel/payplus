const express = require('express');
const zod = require('zod');
const { User } = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const router = express.Router();

// signup and signin routes

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    middleName: zod.string(),
    lastName: zod.string(),
})

router.post('/signup', async (req, res)=> {
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if(!success) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: body.username,
    })

    if(existingUser._id) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.create(body);
    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })

})

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})


module.exports = router;
