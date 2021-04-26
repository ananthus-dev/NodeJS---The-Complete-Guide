const express = require('express');

const app = express();

//The middleware will be executed when the request path after the domain starts withthe path given to the use() functtion
//Since every request path starts with '/' , the below middleware will be executed for every requests
app.use('/', (req, res, next) => {
    console.log('This always runs!');
    next();
});

//will be executed only if request path contains '/add-product'
//http://localhost:3000/add-product/test
//http://localhost:3000/add-product
//The above two requests will be handled my this middleware , since both starts with /add-product
//http://localhost:3000/add-producttest -- But the middlware wil not be executed for this path. For this path the third middlware will be executed
app.use('/add-product', (req, res, next) => {
  console.log('In another middleware!');
  res.send('<h1>The "Add Product" Page</h1>');
});

app.use('/', (req, res, next) => {
  console.log('In another middleware!');
  res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);
