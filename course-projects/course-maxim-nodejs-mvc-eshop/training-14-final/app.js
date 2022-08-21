const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error-controller');
const User = require('./model/user');

const MONGODB_URI = 
  'mongodb+srv://mike:48564856@cluster0.fhcjr.mongodb.net/nodejs-eshop?retryWrites=true&w=majority';


const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf();


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString()
    .split(".").join("")
    .split(":").join("")
    .split("-").join("")
      + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype ==='image/png' || file.mimetype ==='image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null, true);
  }else{
    cb(null, false);
  }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

// adding the routes
const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');
const authRoutes = require('./routes/auth-routes');

app.use(bodyParser.urlencoded({extended:false}));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(
  session({
    secret:'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
  })
);


app.use(csrfProtection); // after initializing the session I call the csrf protection
app.use(flash());
app.use(
  (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken();
    next();
  }
)

//the purpose of this is to store the user in a cantral place under req.user so that the user is accessble in any other route
app.use( (req, res, next) => {
  if (!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    if (!user){
      return next();
    }
    req.user = user;
    next();
  })
  .catch(err =>{
    next(new Error(err));
  });
})


app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/500', errorController.get500Page)
app.use(errorController.get404Page)


mongoose.connect(MONGODB_URI)
.then( result => {
  app.listen(4000);
})
.catch(err => console.log(err));