    const { Account } = require('../models/accountSchema');
    const { User } = require('../models/userSchema');
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = require('../config/config');

    exports.getUser = async (req, res) => {
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
    }
