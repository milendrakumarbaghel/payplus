const { prisma } = require('../prismaClient');


exports.getBalance = async (req, res) => {
  const userAccount = await prisma.account.findUnique({
    where: { userId: req.userId }
  });

  if (!userAccount) {
    return res.status(403).json({ msg: "User not found" });
  }

  const balance = userAccount.balance;
  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  //   console.log(balance);
  return res.status(200).json({
    msg: "Balanced is fetched",
    balance: balance,
    firstName: user.firstName,
  });
}
