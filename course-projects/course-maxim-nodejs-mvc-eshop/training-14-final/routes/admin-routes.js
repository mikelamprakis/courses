const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const adminController = require('../controllers/admin-controller');

router.get('/add-product', isAuth, adminController.getAddProductPage);
router.get('/products', isAuth, adminController.getAllProductsPage)
router.post('/add-product', isAuth, adminController.postAddNewProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProductPage);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

exports.routes = router;