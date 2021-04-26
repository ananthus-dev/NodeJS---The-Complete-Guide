exports.getLogin = (req, res, next) => {
  const loginCookie = req.get('Cookie')?.split(';').find((cookie)=>cookie.includes('loggedIn'));
  const isLoggedIn = loginCookie?loginCookie.split('=')[1]:false
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  res.redirect('/');
};
