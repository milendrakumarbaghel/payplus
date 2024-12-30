const express = require('express');
const router = express.Router();
exports.router = router;

const { authMiddleware } = require('../middlewares/middleware');
const { signUp } = require('../controllers/signUp');
const { signIn } = require('../controllers/signIn');
const { updateUser } = require('../controllers/updateUser');
const { getUser } = require('../controllers/getUser');

// signup route
router.post('/signup', signUp);

//signin route
router.post('/signin', signIn);

//update route
router.put('/updateinfo', authMiddleware, updateUser);

//get users route
router.get('/getusers', getUser)

module.exports = router;
