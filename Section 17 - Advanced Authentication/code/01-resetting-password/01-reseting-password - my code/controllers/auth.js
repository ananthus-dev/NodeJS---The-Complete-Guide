const User = require('../models/user');
const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:'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'
  }
}))

exports.getLogin = (req, res, next) => {
  //req.flash(key) retrieves the value from the session and remove it from session.
  //it  returns an array with single element which is the value
  //it returns empty array if there is no value set corresponding to the given key
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        //req.flash(key,value) sets the value in the session
        // first argument is the key, second one is the value
        req.flash('error', 'Invalid email or password');
        console.log('Log in failed --> user does not exist');
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            console.log('Log in success');
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log('Session saved successfully', err);
              res.redirect('/');
            });
          }
          console.log('Log in failed --> Incorrect password');
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login')
        })
        .catch(err => {
          return res.redirect('/login')
        })
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email }).then((userDoc) => {
    if (userDoc) {
      req.flash('error', 'Email exists already');
      return res.redirect('./signup');
    }
    return bcrypt.hash(password, 12)
      .then((hashedPassword) => {
        console.log('hashedPassword', hashedPassword)
        const user = new User({ email, password: hashedPassword, cart: [] });
        return user.save();
      })
      .then((result) => {
        res.redirect('/login');
        transporter.sendMail({
          to:email,
          from:'ananthus123@gmail.com',
          subject:'Signup Succeeded',
          html:'<h1>You successfully signed up</h1>'
        })
        console.log('result', result)
      })
  })
    .catch((error) => {
      console.log('error', error)
    })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req,res,next)=>{
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  }
  else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/resetPassword',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

