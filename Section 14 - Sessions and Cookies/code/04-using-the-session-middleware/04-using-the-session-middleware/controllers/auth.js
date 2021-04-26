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
  //session property is added by the middleware
  //we can add any property to the session object
  req.session.isLoggedIn = true;
  res.redirect('/products');
};

exports.postLogout = (req, res, next) => {
  //session property is added by the middleware
  //we can add any property to the session object
  req.session.isLoggedIn = false;
  res.redirect('/products');
};
