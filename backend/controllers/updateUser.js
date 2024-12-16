const { Account } = require('../models/accountSchema');
const { User } = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/config');


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
