const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const adminController = require('../controllers/admin-controller');

// /admin/add-product => GET --> get add-product page
router.get('/add-product', isAuth, adminController.getAddProductPage);

// // /admin/product => GET 
router.get('/products', isAuth, adminController.getAllProductsPage)

// /admin/add-product => POST 
router.post('/add-product', isAuth, adminController.postAddNewProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProductPage);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

exports.routes = router;