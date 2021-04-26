const express = require('express');

const { check, body } = require('express-validator/check')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',
    [
        //check method checks for the given field in the queryparams,body,headers,cookies and check if it is valid
        //check method receives single field or array of fields to validate
        //we can customize the validation message using withMessage function
        //we can multiple validation by chaining
        //withMessage function sets the validation message for the validation run just before calling withMessage()
        //here i have added custom validator to prevent a specific email
        check('email')
            .isEmail()
            .withMessage('Invalid value for email')
            .custom((value) => {
                if (value === 'test@test.com') {
                    throw new Error('This email address is forbidden') // this message will be shown as error message
                }
                return true;
            }),
        //body method checks for the fields in the request body only
        //instead of adding custom message for every validation using the withMessage function,
        //we can specify a default message for all validations. Pass the message as a second argument
        //to body function. Works for check function as well
        body('password','Please enter alphanumeric password with atleast 5 characters')
        .isLength({min:5})
        .isAlphanumeric(),
        body('confirmPassword')
        .custom((value,{req})=>{
            if(value !== req.body.password){
                throw new Error('Passwords have to match')
            }
            return true;
        })
    ]
    ,
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/resetPassword', authController.getReset);

router.post('/resetPassword', authController.postReset);

router.get('/resetPassword/:token', authController.getNewPassword);

router.post('/new-password', authController.postUpdatePassword);

module.exports = router;