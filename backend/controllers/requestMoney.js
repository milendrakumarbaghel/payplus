const mongoose = require('mongoose');
const { Account } = require('../models/accountSchema');
const { Request } = require('../models/moneyReqSchema');
const { Notification } = require('../models/notificationSchema');


exports.createRequest = async (req, res) => {
    try {
    const uid = req.userId;
    console.log("uid", uid);
    const { amount, toId } = req.body;

    const request = await Request.create({
      requsterToId: toId,
      requestFromIdId: uid,
      amountRequested: amount,
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

    const request = await Request.find({
      requsterToId: uid,
    })
      .populate({
        path: "requsterToId",
        model: "User",
        select: "firstName",
      })
      .populate({
        path: "requestFromIdId",
        model: "User",
        select: "firstName",
      });
    res.status(200).json({ message: "Request created", data: request });
  } catch (error) {
    res.status(500).json({ message: "Somthing went wrong", error });
  }
}
