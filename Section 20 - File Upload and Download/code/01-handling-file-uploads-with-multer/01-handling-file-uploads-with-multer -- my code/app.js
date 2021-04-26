const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf')
const flash = require('connect-flash');
const multer = require('multer')
const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://ananthu:node-complete@node-complete.wvv4x.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

//initiialising csrf middleware
const csrfProtection = csurf();

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); //first argument is the error object to inform multer that some error has occured. We pass null to inform that there is no error
    //Second argument is the folder name in which the image should be stored.
  },
  filename: (req, file, callback) => {
    callback(null, `${new Date().getTime()}-${file.originalname}`);
    //first argument same as above
    //second argument is the name of the file
    //file.originalname --> actual name of the file
  }
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));

//single means only single file be there in the request
//the argument of single function is the name of the input attribute which holds the file
// app.use(multer().single('image'));// with this approach the ifle will be stored in a buffer in the memory, it can be accessed from req.file.buffer
// app.use(multer({dest:'images'}).single('image'));// with this approach the file will be stored in a folder called 'images' in the filesystem, it can be accessed from req.file.path

// same as above but with more options
// observation--> in the above method the 'images' folder will be automaticallly created
//but in this method the destination folder 'images' should be already there. Otherwise it will throw error
app.use(multer({ storage: fileStorage }).single('image'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

//the csrf middleware looks for the csrf token in all non-get requests in the request body
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
      next(new Error(err));
    }
    );
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(..) // to render some other page instead of redirecting to 500
  // res.redirect('/500')
  console.log('Error Middleware ---->',error)
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: false,
    // isAuthenticated:req.session.isLoggedIn
  })
})

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
