const express = require('express');
const router = express.Router();
const zod = require('zod');
const { authMiddleware } = require('../middlewares/middleware');
const { signUp } = require('../controllers/signUp');
const { signIn } = require('../controllers/signIn');
const { updateUser } = require('../controllers/updateUser');
const { getUser } = require('../controllers/getUser');

// signup route
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    middleName: zod.string(),
    lastName: zod.string(),
})

router.post('/signup', signUp);


//signin route
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post('/signin', signIn);

//update route
const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    middleName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put('/updateinfo', authMiddleware, updateUser);

//get users route
router.get('/getuser', getUser)

module.exports = router;
