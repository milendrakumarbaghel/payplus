const { Account } = require('../models/accountSchema');
const mongoose = require('mongoose');


exports.getBalance = async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })

    res.json({
        balance: account.balance
    })
}
