const express = require('express');
const userRouter = requite('./user');

const router = express.Router();
router.use('/user', userRouter);

module.exports = router;
