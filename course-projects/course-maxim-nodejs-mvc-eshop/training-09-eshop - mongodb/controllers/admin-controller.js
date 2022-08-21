const mongodb = require('mongodb');
const Product = require('../model/product');


exports.getAddProductPage = (req, res, next) => {
    res.render('pages/admin/edit-product', {
        pageTitle:'Add Product',
        path: '/admin/add-product', // We added the path here for logic of hover-over navbar
        editing: false
    });
};

exports.postAddNewProduct = (req,res, next) =>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    
    product.save()
    .then(result => {
        console.log(product);
        console.log('product created...!!!')
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getEditProductPage = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        console.log(product)
        if (!product){
            return res.redirect('/');
        }
        res.render('pages/admin/edit-product', {
            pageTitle:'Edit Product',
            path: '/admin/edit-product', // we put edit product so that no manu element is hover-over hightlighed
            editing: editMode,
            product: product
        });
    })
    .catch(err => console.log(err));
    
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
   
    const product = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDescription, new mongodb.ObjectId(prodId));

    product.save()
    .then(result => {
        console.log('UPDATED PRODUCT')
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    
    Product.deleteById(prodId)
    .then(() => {
        console.log('DESTROYED PRODUCT')
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

    
}


exports.getAllProductsPage = (req, res, next) =>{
    Product.fetchAll()
    .then(products => {
        res.render('pages/admin/admin-products',{
            prods: products,
            pageTitle: 'Admin Products', 
            path: '/admin/products' // We added the path here for logic of hover-over navbar
        });
    })
    .catch(err => console.log(err));
};

