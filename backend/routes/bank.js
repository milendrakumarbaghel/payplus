const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/middleware');
const { getBalance } = require('../controllers/getBalance');
const { moneyTransfer } = require('../controllers/moneyTransfer');
const { createRequest, getRequestList } = require('../controllers/requestMoney');
const { fulfillRequest } = require('../controllers/requestMoney');



//get balance router
router.get('/balance', authMiddleware, getBalance);

//transfer money router
router.post('/transfer', authMiddleware, moneyTransfer);

//create request router
router.post('/create/request', authMiddleware, createRequest);

//get request list router
router.get('/request/list', authMiddleware, getRequestList);

// fulfill a money request (pay and delete)
router.post('/request/fulfill/:requestId', authMiddleware, fulfillRequest);

module.exports = router;
