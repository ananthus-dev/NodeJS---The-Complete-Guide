const User = require('../models/user');

const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const {email,password} = req.body;
  User.findOne({email})
    .then(user => {
      if(!user){
        console.log('Log in failed --> user does not exist');
        return res.redirect('/login')
      }
      bcrypt.compare(password,user.password)
      .then((doMatch)=>{
        if(doMatch){
          console.log('Log in success');
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log('Session saved successfully',err);
            res.redirect('/');
          });
        }
        console.log('Log in failed --> Incorrect password');
        return res.redirect('/login')
      })
      .catch(err=>{
        return res.redirect('/login')
      })
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const{email,password,confirmPassword} = req.body;
  User.findOne({email}).then((userDoc)=>{
    if(userDoc) return res.redirect('./signup');
    return bcrypt.hash(password,12)
    .then((hashedPassword)=>{
      console.log('hashedPassword',hashedPassword)
      const user = new User({email,password:hashedPassword,cart:[]});
      return user.save();
    })
    .then((result)=>{
      console.log('result',result)
      res.redirect('/login');
    })
  })
  .catch((error)=>{
    console.log('error',error)
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
