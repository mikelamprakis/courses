const {validationResult} = require('express-validator/check') 

const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()){
        console.log(errors);
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data  = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name  = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
    .then(hashedPsw => {
        const user = new User({
            email: email,
            name: name,
            password: hashedPsw
        });
        return user.save();
    })
    .then(result => {
        res.status(201).json({ message: 'User created', userId: result._id});
       })
    .catch(err => {
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    let loadedUser;

    User.findOne({email: email})
    .then(user => {
        if (!user){
            const error = new Error('A user with this email could not be found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then( isEqual => {
        if (!isEqual){
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            'somesecret',
            {expiresIn: '1h'}
        );
        res.status(200).json({token: token, userId:loadedUser._id.toString() });
    })
    .catch(err => {
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
    .then(user => {
        if (!user){
            const error = new Error('User not found..');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({status: user.status});
    })
    .catch(err => {
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}



exports.updateUserStatus = (req, res, next) => {
    const newStatus = req.body.status;
    console.log(newStatus);
    User.findById(req.userId)
    .then(user => {
        if (!user){
            const error = new Error('User not found..');
            error.statusCode = 404;
            throw error;
        }
        user.status = newStatus;
        console.log(user);
        return user.save();
    })
    .then(result => {
        res.status(200).json({message: 'User Updated'});
    })
    .catch(err => {
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}