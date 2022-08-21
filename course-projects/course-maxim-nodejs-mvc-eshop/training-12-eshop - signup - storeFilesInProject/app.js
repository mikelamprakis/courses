const path = require('path');

const express = require('express');
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

const app = express();
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

console.log('-----------------222')
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
console.log('-----------------333')
const adminRoutes = require('./routes/admin-routes');
console.log('-----------------3331')
const shopRoutes = require('./routes/shop-routes');
console.log('-----------------3332')
const authRoutes = require('./routes/auth-routes');
console.log('-----------------444')
app.use(bodyParser.urlencoded({extended:false}));
// app.use(multer().single('image')); //single as we expect single file 
// app.use(multer({dest:'images'}).single('image'));  //stores file in a new folder cllled images

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
console.log('-----------------555')
app.use(express.static(path.join(__dirname,'public')));
app.use(
  session({
    secret:'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
  })
);
// after initializing the session I call the csrf protection
app.use(csrfProtection);
app.use(flash());
console.log('-----------------667')
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

app.use( (error, req, res, next) => {
  console.log('=======>>> ERRRROOORRRR');
  res.status(500).render('500-view', {
    pageTitle: 'Error Occured',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
});
})

mongoose.connect(MONGODB_URI)
.then( result => {
  app.listen(4000);
})
.catch(err => console.log(err));