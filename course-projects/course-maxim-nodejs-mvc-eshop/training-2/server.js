require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL, {useNewUrlParser:true},  {useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error)=>{console.error(error)})
db.once('open', ()=>{console.log('Connected to DB')})


app.use(express.json())

const subscribersRouter = require('./routes/subscriberRoutes')
app.use('/subscribers', subscribersRouter)


app.listen(3000, ()=>{
    console.log('Listening on 3000...')
})