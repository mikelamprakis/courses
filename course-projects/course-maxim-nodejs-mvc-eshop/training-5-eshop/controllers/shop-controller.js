// Product CRUD Operations
const Product = require('../model/product');
const Cart = require('../model/cart');

exports.getProductList = (req, res, next) =>{
    Product.fetchAll(products => {
        res.render('pages/shop/product-list',{
            prods: products,
            pageTitle: 'All Products', 
            path: '/products' // We added the path here for logic of hover-over navbar
        });
    });
};

exports.getProductById = (req, res, next) =>{
    const prodId = req.params.productId;
    console.log(prodId);
    Product.findById(prodId, product => {
        console.log(product)
        res.render('pages/shop/product-details', {
            product: product,
            pageTitle: 'Product Details',
            path: '/products'
        })
    });
};



exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('pages/shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};


exports.getCart = (req, res, next) => {
    const cartProducts = [];
    Cart.getCart(cart => {
        console.log("--->", cart)
        Product.fetchAll(products => {
            for (product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                console.log(cartProductData)
                if (cartProductData){
                    console.log("----2")
                    cartProducts.push({productData: product, qty:cartProductData.qty});
                    console.log(cartProducts)
                }
            }
            res.render('pages/shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });    
        })
    })
    
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId)
    Product.findById(prodId, product=> {
        console.log(product);
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart')
};


exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res, next) => {
    res.render('pages/shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
}


exports.getCheckout = (req, res, next) => {
    res.render('pages/shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}