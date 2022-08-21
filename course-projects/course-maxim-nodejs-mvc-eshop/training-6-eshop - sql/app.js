const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// adding the routes
const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');

// adding erro-controller
const errorController = require('./controllers/error-controller');

// adding db configs
const db = require('./util/database');

db.execute('SELECT * FROM PRODUCTS')
.then( result => {
    console.log(result);
})
.catch(err => {
    console.log(err);
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));


app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(errorController.get404Page)

app.listen(4000);