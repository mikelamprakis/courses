const fs = require('fs');
const path = require('path');
const pathUtils = require('../util/path');
const { v4: uuidv4 } = require("uuid");

const p = path.join(pathUtils,'data','products-data.json');
const db = require('../util/database');

const Cart = require('../model/cart');


const getProductsFromFile = callback =>{
        fs.readFile(p, (error, fileContent) => {
            if (error){
                return callback([]);
            }
            callback(JSON.parse(fileContent));
        });
}


module.exports = class Product {
    // Constructor
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
      }
        
    // Methods
    save(){
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
        [this.title, this.price, this.imageUrl, this.description]
        );
    } 


    static deleteById(id) {
        getProductsFromFile(products => {
          const product = products.find(prod => prod.id === id);
          const updatedProducts = products.filter(prod => prod.id !== id);
          fs.writeFile(p, JSON.stringify(updatedProducts), err => {
            if (!err) {
              Cart.deleteProduct(id, product.price);
            }
          });
        });
      }


    static fetchAll(callback){
        return db.execute('SELECT * FROM products')
    }

    static findById(id){
      return db.execute('SELECT * FROM products WHERE products.id = ?',  [id]);
    }
};