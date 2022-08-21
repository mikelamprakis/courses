const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin-controller');

// /admin/add-product => GET --> get add-product page
router.get('/add-product', adminController.getAddProductPage);

// // /admin/product => GET 
router.get('/products', adminController.getAllProductsPage)

// /admin/add-product => POST 
router.post('/add-product', adminController.postAddNewProduct);


router.get('/edit-product/:productId', adminController.getEditProductPage);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

exports.routes = router;