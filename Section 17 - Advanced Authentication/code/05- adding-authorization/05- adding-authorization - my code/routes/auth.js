const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/resetPassword', authController.getReset);

router.post('/resetPassword', authController.postReset);

router.get('/resetPassword/:token', authController.getNewPassword);

router.post('/new-password', authController.postUpdatePassword);

module.exports = router;