const mongoose = require('mongoose');

const moneyRequestSchema = new mongoose.Schema(
  {
    requsterToId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    requestFromIdId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    amountRequested: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", moneyRequestSchema);

module.exports = { Request };
