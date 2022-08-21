const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const User = require('../model/user');


exports.getLogin = (req, res, next) => {
   //console.log(req.get('Cookie'));
   //const isLoggedIn = (req.get('Cookie') ? req.get('Cookie').split('=')[1] : null) === true.toString();
   let message = req.flash('error'); // its an array []
   if (message.length > 0){
      message = message[0];
   }else{
      message=null
   }
   console.log(req.session);
   res.render('pages/auth/login', {
      path: '/login',
      pageTitle: 'Login Page',
      errorMessage: message
      // isAuthenticated: req.session.isLoggedIn, //or req.session.user
      // csrfToken: req.csrfToken()      
   });
 };



exports.postLogin = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;

   const errors = validationResult(req);
   if (!errors.isEmpty()){
      res.render('pages/auth/login', {
         path: '/login',
         pageTitle: 'Login Page',
         errorMessage: errors.array()[0].msg
      })
   }
   User.findOne({email: email})
   .then(user => {
      if (!user) {
         req.flash('error', 'invalid email or password');
         return res.redirect('/login');
      }

      bcrypt.compare(password, user.password)
      .then(doMatch => {
         if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save( err =>{
               console.log(err);
               res.redirect('/')
            });
         }
         res.redirect('/login')
      })
      .catch(err => {
         console.log(err);
         res.redirect('/login')
      })
     
   })
   .catch(err => console.log(err)); 
}

exports.getSignup = (req, res, next) => {
   let message = req.flash('error'); // its an array []
   if (message.length > 0){
      message = message[0];
   }else{
      message=null
   }
   res.render('pages/auth/signup', {
     path: '/signup',
     pageTitle: 'Signup',
     //isAuthenticated: false,
     errorMessage: message,
     oldInput: {
      email:'',
      password:'',
      confirmPassword:''
   }
   });
 };

 exports.postSignup = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;
   const errors = validationResult(req);
   if (!errors.isEmpty()){
      console.log(errors.array());
      return res.status(422).render('pages/auth/signup', {
         path: '/signup',
         pageTitle: 'Signup',
         errorMessage: errors.array()[0].msg ,
         oldInput: {
            email:email,
            password:password,
            confirmPassword:confirmPassword
         }
      })
   }
   // User.findOne({email: email})  // not needed anymore since I am validating that through input validation in routes file
   // .then(userDoc => {
   //    if (userDoc){
   //       req.flash('error', 'Email exists already..')
   //       return res.redirect('/signup');
   //    }
   //    return 
      bcrypt
      .hash(password, 12)
      .then( hashedPassword => {
         const user = new User({
            email:email,
            password:hashedPassword,
            cart: { items:[] } 
         })
         return user.save();
      })
      .then( result => {
         res.redirect('/login');
      })
   // })
   // .catch(err => console(err));
 }

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      console.log(err);
      res.redirect('/')
   });
}

