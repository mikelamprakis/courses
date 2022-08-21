const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator/check');
const User = require('../model/user');
const authController = require('../controllers/auth-controller');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', 
[
    body('email')
    .isEmail().withMessage('Invalid Email! Please add a valid email'),
    body('password')
    .isLength({min:5}).withMessage('Invalid password length')
    .isAlphanumeric().withMessage('Password is not alphanumeric')

]
, authController.postLogin);

router.post('/signup', 
[
 //validation 1   
 check('email').isEmail()  // checking email field with build-in function
.withMessage('Please enter valid email..')  // Adding our custom message
.custom((value, {req}) => {       // Adding our custom validation
   if (value === 'test@test.com'){
       throw new Error('This email is forbiden...')
   }
   return true;
})
.custom( (value, {req}) => {
    return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject(
            'E-Mail exists already, please pick a different one.'
          );
        }
      });

})
,
//validation 2
body('password', 'Please enter a valid psw which is alphanumeric')
.isLength({min: 5}) //.withMessage('Please enter valid psw...')
.isAlphanumeric()
,
//validation 3
body('confirmPassword').custom( (value, {req}) => {
    if (value !== req.body.password){
        throw new Error('Passwords have to match!!');
    }
    return true;
})
], 
authController.postSignup);

router.post('/logout', authController.postLogout);


module.exports = router;