const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-eshop', 'mike', '48564856', {
    dialect:'mysql', 
    host:'localhost'
});

module.exports = sequelize;