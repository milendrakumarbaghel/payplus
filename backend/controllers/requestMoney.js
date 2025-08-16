const { prisma } = require('../prismaClient');


exports.createRequest = async (req, res) => {
  try {
    const uid = req.userId;
    console.log("uid", uid);
    const { amount, toId } = req.body;

    const request = await prisma.request.create({
      data: {
        requesterToId: toId,
        requestFromId: uid,
        amountRequested: amount,
      },
    });
    res.status(200).json({ message: "Request created", data: request });
  } catch (error) {
    res.status(500).json({ message: "Somthing went wrong", error });
  }
}


exports.getRequestList = async (req, res) => {
  try {
    const uid = req.userId;
    console.log("uid", uid);

    const requests = await prisma.request.findMany({
      where: { requesterToId: uid },
      include: {
        requesterTo: { select: { id: true, firstName: true } },
        requestFrom: { select: { id: true, firstName: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map to the shape frontend expects (using requestFromIdId and requsterToId keys)
    const mapped = requests.map((r) => ({
      _id: r.id,
      requsterToId: { _id: r.requesterTo.id, firstName: r.requesterTo.firstName },
      requestFromIdId: { _id: r.requestFrom.id, firstName: r.requestFrom.firstName },
      amountRequested: r.amountRequested,
      status: r.status,
    }));

    res.status(200).json({ message: "Request created", data: mapped });
  } catch (error) {
    res.status(500).json({ message: "Somthing went wrong", error });
  }
}

// Pay a request and delete it
exports.fulfillRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await prisma.request.findUnique({ where: { id: requestId } });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.requesterToId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to fulfill this request' });
    }

    const amount = request.amountRequested;
    await prisma.$transaction(async (tx) => {
      const fromAcc = await tx.account.findUnique({ where: { userId: req.userId } });
      if (!fromAcc || fromAcc.balance < amount) {
        throw new Error('Insufficient amount');
      }
      const toAcc = await tx.account.findUnique({ where: { userId: request.requestFromId } });
      if (!toAcc) throw new Error('Receiver account not found');

      await tx.account.update({ where: { id: fromAcc.id }, data: { balance: { decrement: amount } } });
      await tx.account.update({ where: { id: toAcc.id }, data: { balance: { increment: amount } } });

      await tx.request.delete({ where: { id: requestId } });
    });

    return res.status(200).json({ message: 'Request fulfilled', amount });
  } catch (error) {
    console.error('Fulfill error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
