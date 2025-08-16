const zod = require('zod');
const { prisma } = require('../prismaClient');

const transferBody = zod.object({
  amount_to_transfer: zod.number(),
  paye_id: zod.string(),
});

const transferFunds = async (fromUserId, toUserId, amount) => {
  return await prisma.$transaction(async (tx) => {
    const fromAcc = await tx.account.findUnique({ where: { userId: fromUserId } });
    if (!fromAcc) throw new Error('From account not found');
    if (fromAcc.balance < amount) throw new Error('Insufficient amount');

    const toAcc = await tx.account.findUnique({ where: { userId: toUserId } });
    if (!toAcc) throw new Error('To account not found');

    await tx.account.update({
      where: { id: fromAcc.id },
      data: { balance: { decrement: amount } },
    });

    await tx.account.update({
      where: { id: toAcc.id },
      data: { balance: { increment: amount } },
    });

    return 'Transfer successful';
  });
};

exports.moneyTransfer = async (req, res) => {
  try {
    const { data, error } = transferBody.safeParse(req.body);
    if (error) {
      throw new Error("Invalid input");
    }

    await transferFunds(
      req.userId,
      data.paye_id,
      data.amount_to_transfer
    );

    return res.status(200).json({ msg: "Transfer successful" });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
}
