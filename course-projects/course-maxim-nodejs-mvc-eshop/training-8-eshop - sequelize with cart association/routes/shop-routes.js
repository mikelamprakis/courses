const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop-controller')

router.get('/', shopController.getIndex) //index/shop
router.get('/products', shopController.getProductList) //product-list
router.get('/products/:productId', shopController.getProductById) // product-details
router.get('/cart', shopController.getCart)
router.post('/cart', shopController.postCart)
router.post('/cart-delete-item', shopController.postCartDeleteProduct)
router.post('/create-order', shopController.postOrder);
router.get('/orders', shopController.getOrders)
router.get('/checkout', shopController.getCheckout)

module.exports = router;