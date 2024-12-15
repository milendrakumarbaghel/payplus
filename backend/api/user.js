const express = require('express');
const router = express.Router();
const zod = require('zod');
const { User, Account } = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
// const { User, Account } = require('./account');
const { authMiddleware } = require('../middleware');

// signup route
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    middleName: zod.string(),
    lastName: zod.string(),
})

router.post('/signup', async (req, res) => {
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
});

// router.post("/signup", async (req, res) => {
//     const { success } = signupSchema.safeParse(req.body)
//     if (!success) {
//         return res.status(411).json({
//             message: "Email already taken / Incorrect inputs"
//         })
//     }

//     const existingUser = await User.findOne({
//         username: req.body.username
//     })

//     if (existingUser) {
//         return res.status(411).json({
//             message: "Email already taken/Incorrect inputs"
//         })
//     }

//     const user = await User.create({
//         username: req.body.username,
//         password: req.body.password,
//         firstName: req.body.firstName,
//         middleName: req.body.middleName,
//         lastName: req.body.lastName,
//     })
//     const userId = user._id;

//     await Account.create({
//         userId,
//         balance: 1 + Math.random() * 10000
//     })

//     const token = jwt.sign({
//         userId
//     }, JWT_SECRET);

//     res.json({
//         message: "User created successfully",
//         token: token
//     })
// })


//signin route
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post('/signin', async (req, res) => {
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
            // message: "signed in",
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

//update route
const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    middleName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put('/updateinfo', authMiddleware, async (req, res) => {
    const body = req.body;
    const {success} = updateSchema.safeParse(req.body);

    if(!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({
        _id: body.userId
    }, body)

    res.json({
        message: "Updated successfully"
    })
})

//get users route
router.get('/getuser', async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            },
            middleName: {
                "$regex": filter
            },
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
