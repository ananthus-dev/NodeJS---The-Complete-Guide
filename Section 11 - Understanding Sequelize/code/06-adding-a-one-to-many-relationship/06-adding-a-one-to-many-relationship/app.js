const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Only one of the following associations need to be defined. No problem if both are defined.
//a user creating a product. When a user is deleted , his products should also be deleted. So 'CASCADE'
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//A User can create many products
User.hasMany(Product);

sequelize
  //force true is given to drop the existing tables and create new based on the associations defined above.
  //This setting will not be reused, since it always deletes the existing tables and create new ones.
  //we used it here inorder to recreate the products table with associations to the user table
  .sync({ force: true })
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
