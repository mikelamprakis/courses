const mongodb = require('mongodb');
const Product = require('../model/product');
const fileHelper = require('../util/file');


exports.getAddProductPage = (req, res, next) => {
    // if (!req.session.isLoggedIn){
    //     return res.redirect('/login');
    // }
   // console.log(sadada);
    res.render('pages/admin/edit-product', {
        pageTitle:'Add Product',
        path: '/admin/add-product', // We added the path here for logic of hover-over navbar
        editing: false,
        errorMessage: false
        // isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddNewProduct = (req,res, next) =>{
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if (!image){
        return res.status(422).render('pages/admin/edit-product', {
                pageTitle:'Edit Product',
                path: '/admin/edit-product', 
                editing: false,
                hasError: true,
                errorMessage: 'Attached file is not an image',
                validationErrors:[],
                product: {
                    title: title,
                    price: price,
                    description: description,
                    imageUrl: image,
                }
        }) 
    }

    const imagePath = image.path ;  
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imagePath, //save the path in DB and the file in the file systemm/project
        userId: req.user, //._id
    });
    
    product.save() //this save method is now comming from mongoose. We dont need to define it in the model.
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
            product: product,
            errorMessage: false
            // isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err));
    
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDescription = req.body.description;
   
    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        if (image){
            fileHelper.deleteFile(product.imageUrl);
            product.imageUrl = image.path;
        }
        product.description = updatedDescription;
        return product.save();
    })
    .then(result => {
        console.log('UPDATED PRODUCT')
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        if (!product){
            return next(new Error('Product not found'));
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({_id:prodId, userId: req.user._id});
    })
    .then(() => {
        console.log('DESTROYED PRODUCT')
        res.redirect('/admin/products');
    })
    .catch(err => next(err));

    // Product.findByIdAndRemove(prodId)
    // .then(() => {
    //     console.log('DESTROYED PRODUCT')
    //     res.redirect('/admin/products');
    // })
    // .catch(err => console.log(err));
}

const ITEMS_PER_PAGE = 2;


exports.getAllProductsPage = (req, res, next) =>{
    const page = +req.query.page || 1;
    let totalItems;
   
    Product.find()
    // .select('title price -_id') //get selected data of products
    // .populate('userId', 'name') //get detailed data of user
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
        console.log(products);
        res.render('pages/admin/admin-products',{
            prods: products,
            pageTitle: 'Admin Products', 
            path: '/admin/products', // We added the path here for logic of hover-over navbar
            // isAuthenticated: req.session.isLoggedIn
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    })
    .catch(err => {
        console.log(err);
        // res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

