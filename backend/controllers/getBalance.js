const { Account } = require('../models/accountSchema');
const { User } = require('../models/userSchema');
const mongoose = require('mongoose');


exports.getBalance = async (req, res) => {
    const userAccount = await Account.findOne({
    userId: req.userId,
  });

  if (!userAccount) {
    return res.status(403).json({ msg: "User not found" });
  }

  const balance = userAccount.balance;
  const user = await User.findOne({
    _id: req.userId,
  });
  
  //   console.log(balance);
  return res.status(200).json({
    msg: "Balanced is fetched",
    balance: balance,
    firstName: user.firstName,
  });
}
