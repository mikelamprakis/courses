const { OrderedBulkOperation } = require('mongodb');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit')
const stripe = require('stripe')('sk_test_51LPwVMBIih2kjLmFDOXsCcPbyHfy0dEUTpXa4Etp5mpFyn8hEkIMDa1dJCUU3qQpRa1FQRO4tkvjCXPQ8BC8zKFC00Vnh5lRmz')
const Product = require('../model/product');
const Order = require('../model/order');

const ITEMS_PER_PAGE = 2;

exports.getProductList = (req, res, next) =>{
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
        console.log(products);
        res.render('pages/shop/product-list',{
            prods: products,
            pageTitle: 'All Products', 
            path: '/products',  // We added the path here for logic of hover-over navbar  
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)        
        });
    })
    .catch(err => { 
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
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
    .catch(err => {
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }); 
};



exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
        res.render('pages/shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        })
    })
    .catch(err => {
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}


exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then( user => {
    const products = user.cart.items;
    res.render('pages/shop/cart', {
       path: '/cart',
       pageTitle: 'Your Cart',
       products: products
    });    
  })
  .catch(err =>  {
    console.log(err)
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
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
    .catch(err => {
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
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
   .catch(err => {
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
   });
};


exports.getCheckoutSuccess = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then( user => {
        const products = user.cart.items.map(item =>{
            return {quantity: item.quantity, product: {...item.productId._doc}}
        })
        const order = new Order({
            user:{
                email: req.user.email,
                userId: req.user 
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
}


exports.getCheckout = (req, res, next) => {
    let products;
    let total = 0;
    req.user
      .populate('cart.items.productId')  //good explanation of populate: https://stackoverflow.com/questions/38051977/what-does-populate-in-mongoose-mean
      .then(user => {
        products = user.cart.items;
        total = 0;
        products.forEach(p => {
          total += p.quantity * p.productId.price;
        });
        return stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products.map(p => {
                return {
                    name: p.productId.title,
                    description: p.productId.description,
                    amount:p.productId.price * 100,  // because we need to specify it in cents
                    currency: 'usd',
                    quantity: p.quantity
                }
            }),
            success_url: req.protocol + '://' + req.get('host') + '/checkout/success',   //http://localhost:3000
            cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
        })
      }).then(session => {
        res.render('pages/shop/checkout', {
            path: '/checkout',
            pageTitle: 'Checkout',
            products: products,
            totalSum: total,
            sessionId: session.id
          });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };


exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId).then(order => {
        if (!order) {
            return next(new Error('No order Found'));
        }

        if(order.user.userId.toString() !==req.user._id.toString()){
            return next(new Error('Unauthorized'));
        }

        const invoiceName = 'invoice' + orderId + '.pdf';
        const invoicePath = path.join('data', 'invoices', invoiceName);
        
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');  
        
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text('Invoice', {
            underline:true
        })
        pdfDoc.text('---------------------');

        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice += prod.quantity * prod.product.price;
            pdfDoc.text(
                prod.product.title + ' - ' + prod.quantity + ' x ' + '$'+ prod.product.price
            );
        })
        pdfDoc.text('Total Price: $' + totalPrice);
        pdfDoc.end();
    }).catch(err => next(err))
    
}