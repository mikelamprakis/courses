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

    req.user
    .createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
    })
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description,
    //    // userId: req.user.id
    // })
    .then(result => {
        console.log(result);
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
    //Product.findById(prodId)
    req.user.getProducts({where: {id:prodId}})
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
   
    Product.findById(prodId)
    .then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        return product.save(); //this is a new promise so we need another then block
    })
    .then(result => {
        console.log('UPDATED PRODUCT')
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    //WAY 1
    //Product.destroy({where: {id:prodId}});

    //WAY 2
    Product.findById(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        console.log('DESTROYED PRODUCT')
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

    
}


exports.getAllProductsPage = (req, res, next) =>{
    //Product.findAll()
    req.user.getProducts()
    .then(products => {
        res.render('pages/admin/admin-products',{
            prods: products,
            pageTitle: 'Admin Products', 
            path: '/admin/products' // We added the path here for logic of hover-over navbar
        });
    })
    .catch(err => console.log(err));
};



