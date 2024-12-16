const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/middleware');
const { Account } = require('../config/database');
const { getBalance } = require('../controllers/getBalance');
const { moneyTransfer } = require('../controllers/moneyTransfer');



//get balance router
router.get('/balance', authMiddleware, getBalance);

//transfer money router
router.post('/transfer', authMiddleware, moneyTransfer)

module.exports = router;
