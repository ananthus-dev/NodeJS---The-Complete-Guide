const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);
//If we have a route like products/delete , and if we keep it below the above route, then that route will never be reached.
//Because 'delete' will be treated as a product id.
//So in such cases where there is a dynamic route and specific route , we have to place the specific route first , here /products/delete

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
