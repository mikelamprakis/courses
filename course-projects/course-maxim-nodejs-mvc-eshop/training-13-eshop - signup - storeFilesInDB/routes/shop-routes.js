const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const shopController = require('../controllers/shop-controller')

router.get('/', shopController.getIndex) //index/shop
router.get('/products', shopController.getProductList) //product-list
router.get('/products/:productId', shopController.getProductById) // product-details
router.get('/cart', isAuth, shopController.getCart)
router.post('/cart', isAuth,  shopController.postCart)
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)

router.get('/orders', isAuth, shopController.getOrders)
// router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.get('/checkout/success', shopController.getCheckoutSuccess);
router.get('/checkout/cancel', shopController.getCheckout);
router.get('/checkout', isAuth, shopController.getCheckout);

module.exports = router;