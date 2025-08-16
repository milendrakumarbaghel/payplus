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
