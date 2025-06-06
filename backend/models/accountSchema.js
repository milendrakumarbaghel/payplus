const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model('Account', bankSchema);


module.exports = { Account };
