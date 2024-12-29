const { Account } = require('../models/accountSchema');
const { User } = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const zod = require('zod');
const mongoose = require('mongoose');

const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    middleName: zod.string().optional(),
    lastName: zod.string().optional(),
})


exports.updateUser = async (req, res) => {
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
}
