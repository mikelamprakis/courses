const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const mongoConnect = require('./util/database').mongoConnect;

const User = require('./model/user');

// adding the routes
const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');

// adding erro-controller
const errorController = require('./controllers/error-controller');



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

//the purpose of this is to store the user in a cantral place under req.user so that the user is accessble in any other route
app.use( (req, res, next) => {
  User.findById('62c71545179f72bdc3b05a41')
  .then(user => {
    req.user = new User(user.name, user.email, user.cart, user._id);
    next();
  })
  .catch(err => console.log(err));
})


app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(errorController.get404Page)

mongoConnect(() => {
  app.listen(4000);
})


