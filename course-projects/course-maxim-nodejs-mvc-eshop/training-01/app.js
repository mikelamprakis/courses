const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Create express app
const app = express();

// Database
mongoose.connect('mongodb://localhost/motivation', {
    // userNewUrlParser : true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.once('open', ()=>{
    console.log('Connected to MongoDB...')
})

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res)=>{
    res.send('Hello world');
});


const QuotesRoute = require('./routes/QuotesRoutes')
app.use('/quotes', QuotesRoute);

// Starting server 
app.listen(3000, console.log('Listening on port 3000...'));

