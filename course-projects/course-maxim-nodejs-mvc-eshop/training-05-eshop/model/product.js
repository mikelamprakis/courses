const fs = require('fs');
const path = require('path');
const pathUtils = require('../util/path');
const { v4: uuidv4 } = require("uuid");

const p = path.join(pathUtils,'data','products-data.json');

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
        getProductsFromFile(products => {
            // Check if we are editing an existing product
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products]
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {console.log(err)});
            }else{
            // Else we are adding a new product    
                this.id = uuidv4();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err =>{console.log(err)});
            }
        })
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
        getProductsFromFile(callback);
    }

    static findById(id, cb){
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
           console.log(product);
            cb(product);
        });
    }
};