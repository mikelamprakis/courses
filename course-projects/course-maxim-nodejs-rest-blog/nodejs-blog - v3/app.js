const express  = require('express');
const app = express();
const bodyparser = require('body-parser')
const feedRoutes = require('./routes/feed-routes');
const authRoutes = require('./routes/auth-routes');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');



const fileStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null,'./images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString()
        .split(".").join("")
        .split(":").join("")
        .split("-").join("")
          + '-' + file.originalname);
      }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype ==='image/png' || file.mimetype ==='image/jpg' || file.mimetype === 'image/jpeg'){
      cb(null, true);
    }else{
      cb(null, false);
    }
  }

app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(bodyparser.json());
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  //in order to be able to access the headers in the client side
    next();
})





app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);



app.use(
    (error, req, res, next) => {
        console.log('');
        const status = error.statusCode || 500;
        const message = error.message;
        const data = error.data;
        res.status(status).json({ message: message, data: data });
    }
)

mongoose.connect(
    'mongodb+srv://mike:48564856@cluster0.fhcjr.mongodb.net/nodejs-blog?retryWrites=true&w=majority'
    )
    .then( result => {
        const server = app.listen(8081);
        const io = require('./socket').init(server);
        io.on('connection', socket => {
          console.log('Client connected');
        });
    })
    .catch(err => console.log(err));
