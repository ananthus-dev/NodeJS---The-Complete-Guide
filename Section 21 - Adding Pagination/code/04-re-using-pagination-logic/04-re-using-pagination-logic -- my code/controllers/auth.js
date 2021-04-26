const User = require('../models/user');
const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

//validationResult function returns all the validation messages thrown by the validation middlewares
const { validationResult } = require('express-validator/check')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
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
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('Validation errors -->', errors.array());
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array().reduce((acc, value) => (`${acc}.\n${value.msg}`), ''),
      oldInput: { email, password },
      validationErrors: errors.array()
    });
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        console.log('Log in failed --> user does not exist');
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInput: { email, password },
          validationErrors: []
        });
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
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            oldInput: { email, password },
            validationErrors: []
          });
        })
        .catch(err => {
          return res.redirect('/login')
        })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};


exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  //validation middleware will have added the validation errors to the request object
  //validationResult function pulls all those errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('Validation errors -->', errors.array())
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array().reduce((acc, value) => (`${acc}.\n${value.msg}`), ''),
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array()
    });
  }

  bcrypt.hash(password, 12)
    .then((hashedPassword) => {
      console.log('hashedPassword', hashedPassword)
      const user = new User({ email, password: hashedPassword, cart: [] });
      return user.save();
    })
    .then((result) => {
      res.redirect('/login');
      transporter.sendMail({
        to: email,
        from: 'ananthus123@gmail.com',
        subject: 'Signup Succeeded',
        html: '<h1>You successfully signed up</h1>'
      })
      console.log('result', result)
    })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
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

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/resetPassword');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with that email exists');
          return res.redirect('/resetPassword')
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; //setting expiration as 1 hour;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        return transporter.sendMail({
          to: req.body.email,
          from: 'ananthus123@gmail.com',
          subject: 'Password Reset',
          html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/resetPassword/${token}">link</a> to set a new password</p>
        `
        })
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      })
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  console.log('token------', token)
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      }
      else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })

}

exports.postUpdatePassword = (req, res, next) => {
  const { userId, password, passwordToken } = req.body;
  // User.findById(userId)
  User.findOne({ _id: userId, resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      console.log('---------------> User found');
      return bcrypt.hash(password, 12)
        .then((hashedPassword) => {
          console.log('hashedPassword', hashedPassword)
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpiration = undefined;
          return user.save();
        })
    })
    .then(() => {
      console.log('---------------> User password updated');
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
        errorMessage: message,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })

}