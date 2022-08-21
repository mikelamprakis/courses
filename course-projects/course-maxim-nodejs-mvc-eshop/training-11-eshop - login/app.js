const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = 'mongodb+srv://mike:48564856@cluster0.fhcjr.mongodb.net/nodejs-eshop?retryWrites=true&w=majority';
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})


app.set('view engine', 'ejs');
app.set('views', 'views');


const User = require('./model/user');

// adding the routes
const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');
const authRoutes = require('./routes/auth-routes');

// adding erro-controller
const errorController = require('./controllers/error-controller');



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(
  session({
    secret:'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
  })
  );

//the purpose of this is to store the user in a cantral place under req.user so that the user is accessble in any other route

app.use( (req, res, next) => {
  if (!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
})


app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404Page)

mongoose.connect(MONGODB_URI)
.then( result => {
 User.findOne().then(user => {
  if (!user){
    const user = new User({ name:'mike', email:'mike@gmail.com', cart:{items:[]} });
    user.save();
  }
 })
  app.listen(4000);
})
.catch(err => console.log(err));


