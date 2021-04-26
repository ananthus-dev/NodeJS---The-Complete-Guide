const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req
  //     .get('Cookie')
  //     .split(';')[1]
  //     .trim()
  //     .split('=')[1] === 'true';
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('606955293407a03ff4f64140')
  .then(user => {
    req.session.user = user;
    req.session.isLoggedIn = true;
    res.redirect('/');
    
  })
  .catch(err => console.log(err));
};
