const mongoose = require('mongoose');
const zod = require('zod');
const { Account } = require('../models/accountSchema');

const transferBody = zod.object({
  amount_to_transfer: zod.number(),
  paye_id: zod.string(),
});


const transferFunds = async (fromAccountId, toAccountId, amount, session) => {
  try {
    const fromAccount = await Account.findOneAndUpdate(
      { _id: fromAccountId },
      { $inc: { balance: -amount } },
      { new: true, session }
    );

    const toAccount = await Account.findOneAndUpdate(
      { userId: toAccountId },
      { $inc: { balance: amount } },
      { new: true, session }
    );

    if (!fromAccount || !toAccount) {
      throw new Error("Account not found");
    }

    return "Transfer successful";
  } catch (error) {
    console.error(error);
    throw new Error("Error updating balances");
  }
};

exports.moneyTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { data, error } = transferBody.safeParse(req.body);
    if (error) {
      throw new Error("Invalid input");
    }

    const userAccount = await Account.findOne({ userId: req.userId }).session(
      session
    );
    const balance = userAccount.balance;

    if (balance < data.amount_to_transfer) {
      throw new Error("Insufficient amount");
    }

    await transferFunds(
      userAccount._id,
      data.paye_id,
      data.amount_to_transfer,
      session
    );
    await session.commitTransaction();

    return res.status(200).json({ msg: "Transfer successful" });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();

    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  } finally {
    session.endSession();
  }
}
