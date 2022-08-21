// Product CRUD Operations
const { OrderedBulkOperation } = require('mongodb');
const Product = require('../model/product');
const Order = require('../model/order');

exports.getProductList = (req, res, next) =>{
    Product.find()
    .then(products => {
        console.log(products);
        res.render('pages/shop/product-list',{
            prods: products,
            pageTitle: 'All Products', 
            path: '/products' // We added the path here for logic of hover-over navbar
        });
    })
    .catch(err => console.log(err));
};

exports.getProductById = (req, res, next) =>{
    const prodId = req.params.productId;
    
    Product.findById(prodId)
    .then(product => {
        console.log(product);
      res.render('pages/shop/product-details', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err)); 
};



exports.getIndex = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('pages/shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        })
    })
    .catch(err => {
        console.log(err);
    });
}


exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  
  .then( user => {
    const products = user.cart.items;
    console.log('----');
    console.log(products);
    res.render('pages/shop/cart', {
       path: '/cart',
       pageTitle: 'Your Cart',
       products: products
    });    
  })
  .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId).then(product => {
        req.user.addToCart(product);
        res.redirect('/cart');
    })
    .then(result => {
        console.log(result);
    })
};


exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
    .then( result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));

}

exports.getOrders = (req, res, next) => {
   Order.find({'user.userId' : req.user._id})
   .then(orders => {
     res.render('pages/shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
     });
   })
   .catch(err => console.log(err));
};


exports.postOrder = (req, res, next) => {
   req.user
    .populate('cart.items.productId')
    .then( user => {
        const products = user.cart.items.map(item =>{
            return {quantity: item.quantity, product: {...item.productId._doc}}
        })
        const order = new Order({
            user:{
                name: req.user.name,
                userId: req.user //._id
            },
            products: products
        });
        return order.save();
    })
    .then(result => {
        return req.user.clearCart();
    })
    .then(() =>{
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
};


exports.getCheckout = (req, res, next) => {
    res.render('pages/shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}