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
    const newProduct = new Product(null, title, imageUrl, description, price );
    newProduct.save();
    res.redirect('/');
};

exports.getEditProductPage = (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.productId;
    console.log("----1111112->" + typeof prodId);
    console.log("----1111112->" + prodId.length);
    Product.findById(prodId, product => {
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
    
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
}


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}


exports.getAllProductsPage = (req, res, next) =>{
    Product.fetchAll(products => {
        res.render('pages/admin/admin-products',{
            prods: products,
            pageTitle: 'Admin Products', 
            path: '/admin/products' // We added the path here for logic of hover-over navbar
        });
    });
};



