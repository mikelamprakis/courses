const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');



module.exports = class Cart {

    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err,fileContent) => {
            let cart = {products:[], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent)
            }
            // Analyze the cart -> find existing products
            console.log(cart);
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id );
            const existingProduct = cart.products[existingProductIndex];
            // Add new product/increase quantity
            let updatedProduct;
            if (existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty +1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }else{
                updatedProduct = {id: id, qty:1}
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice; //+productPrice because by puting only productPrice it treats it as a string (as its saved as string on product constructor)
            fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
        })
    }


    static deleteProduct(id, productPrice){
        // Fetch the previous cart
        fs.readFile(p, (err,fileContent) => {
            if (err) {
                return;
            }

            // Find the product and product quantity
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product){
                return;
            }
            const productQty = product.qty;

            // Return the updated cart without that product and adjust the totalPrice
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
            fs.writeFile(p, JSON.stringify(updatedCart), err => {console.log(err)});
        });
    }



    static getCart(cb){
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err){
                cb(null);
            }else{
                cb(cart);
            }
        });
    }


}