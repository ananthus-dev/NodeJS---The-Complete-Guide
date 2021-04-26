const express = require('express');

const {check} = require('express-validator/check')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

//check method checks for the given field in the queryparams,body,headers,cookies and check if it is valid
//check method receives single field or array of fields to validate
//we can customize the validation message using withMessage function
router.post('/signup',check('email').isEmail().withMessage('Invalid value for email'),authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/resetPassword', authController.getReset);

router.post('/resetPassword', authController.postReset);

router.get('/resetPassword/:token', authController.getNewPassword);

router.post('/new-password', authController.postUpdatePassword);

module.exports = router;