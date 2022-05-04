const express = require('express');
const router = express.Router();
const {signUPUser,showUser,deleteUPUser,showUserById,loginUser} = require('../controller/')
const {signupValidation,accessTokenVerify} = require('../validation/')

router.post('/signup',signupValidation,signUPUser)
router.post('/login',signupValidation,loginUser)
router.delete('/',accessTokenVerify,deleteUPUser)
router.get('/single',accessTokenVerify,showUserById)
router.get('/',showUser)

module.exports = router