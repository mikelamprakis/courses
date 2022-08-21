const express = require('express')
const app = express();

// const path = require('path')

// Database setup
//const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose')

const mongoUrlLocal  = "mongodb://localhost";
//const mongoUrlDocker = "mongodb://rootuser:rootpass@mongodb";
const dbName = "/mongodbt4local";
const mongoClientOptions = {useNewUrlParser: true, useUnifiedTopology: true };

// MongoClient.connect(mongoUrlLocal + dbName, mongoClientOptions, function (err, client){
//     if (err) throw err;
//     const db = client.db(dbName)
// })

mongoose.connect(mongoUrlLocal + dbName, mongoClientOptions)
const db = mongoose.connection;

db.on('error', (error)=>{console.error(error)})
db.once('open', ()=>{console.log('Connected to DB')})

// Middleware
app.use(express.json())
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

const routeObject = require('./routes')
app.use('/api/v1', routeObject)

// Starting server
app.listen(3000, console.log('listening at port 3000...'))