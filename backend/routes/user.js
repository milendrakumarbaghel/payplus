const express = require('express');
const router = express.Router();
exports.router = router;
const { authMiddleware } = require('../middlewares/middleware');
const { signUp } = require('../controllers/signUp');
const { signIn } = require('../controllers/signIn');
const { updateUser } = require('../controllers/updateUser');
const { getUser } = require('../controllers/getUser');
const { googleSignin } = require('../controllers/googleSignin');



// signup route
router.post('/signup', signUp);

//signin route
router.post('/signin', signIn);

//update routes
router.put('/updateinfo', authMiddleware, updateUser);
router.put('/user-update', authMiddleware, updateUser); // alias used by frontend

//get users route (auth to exclude current user)
router.get('/getusers', authMiddleware, getUser);

//google signin route
router.post('/google-auth', googleSignin);

module.exports = router;
