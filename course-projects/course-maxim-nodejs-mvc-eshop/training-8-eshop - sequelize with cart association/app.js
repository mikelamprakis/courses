const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// adding the routes
const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');

// adding erro-controller
const errorController = require('./controllers/error-controller');

// adding db configs
const sequelize = require('./util/database');
const Product = require('./model/product');
const User = require('./model/user');
const Cart = require('./model/cart');
const CartItem = require('./model/cart-item');
const Order = require('./model/order');
const OrderItem = require('./model/order-item');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use( (req, res, next) => {
  User.findById(1)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
})


app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(errorController.get404Page)

//Associations between Product-User
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product); // we dont really need this as it is the same as above line with belongs to 

//Associations between Cart-User
Cart.belongsTo(User);
User.hasOne(Cart);

//Associations between Cart-Product
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

//Association between User-Order
Order.belongsTo(User);
User.hasMany(Order);

//Association between Order-Product
Order.belongsToMany(Product, {through: OrderItem});



sequelize
  // .sync({force:true}) //we use force to overwrite the initial table with the new configs with relations
  .sync()
  .then(result => {
    return User.findById(1);  
  })
  .then(user => {
    if (!user){
      return User.create({name:'Max', email: 'max@gmail.com'})
    }
    return Promise.resolve(user); //because the above is a promise I need to be consistent and return promise in both cases and NOT a promise and an object
  })
  .then(user => {
    return user.createCart();
  })
  .then(cart => {
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });

