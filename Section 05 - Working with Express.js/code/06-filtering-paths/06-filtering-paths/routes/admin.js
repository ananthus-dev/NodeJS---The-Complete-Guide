const express = require('express');

const router = express.Router();

// /admin/add-product - GET
//While trying to match the request , now it will check only for /add-product , since /admin has already been splitted out from app.j
router.get('/add-product', (req, res, next) => {
  //But in the form url , we have to give the complete url, i.e /admin/add-product
  res.send(
    '<form action="/admin/add-product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
  );
});

// /admin/add-product - POST
router.post('/add-product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
