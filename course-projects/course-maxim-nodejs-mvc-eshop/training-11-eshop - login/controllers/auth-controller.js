const User = require('../model/user');

exports.getLogin = (req, res, next) => {
   //console.log(req.get('Cookie'));
   //const isLoggedIn = (req.get('Cookie') ? req.get('Cookie').split('=')[1] : null) === true.toString();
   console.log(req.session);
   res.render('pages/auth/login', {
      path: '/login',
      pageTitle: 'Login Page',
      isAuthenticated: req.session.isLoggedIn //or req.session.user
   });
 };



exports.postLogin = (req, res, next) => {
   //req.isLoggedIn = true;
   //res.setHeader('Set-Cookie','loggedIn=true'); //Expires=; Max-Age=10; Domain; Secure; HttpOnly;
   User.findById('62cacf50bb87a2bb469eb981')
   .then(user => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save( err =>{
         console.log(err);
         res.redirect('/');
      });
   })
   .catch(err => console.log(err)); 
}

exports.getSignup = (req, res, next) => {
   res.render('pages/auth/signup', {
     path: '/signup',
     pageTitle: 'Signup',
     isAuthenticated: false
   });
 };


 exports.postSignup = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;

   User.findOne({email: email})
   .then(userDoc => {
      if (userDoc){
         return res.redirect('/signup');
      }

      const user = new User({
         email:email,
         password:password,
         cart: { items:[] } 
      })
      return user.save();
   })
   .then( result => {
      res.redirect('/login');
   })
   .catch(err => console(err));


 }

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      console.log(err);
      res.redirect('/')
   });
}

