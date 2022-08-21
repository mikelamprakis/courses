const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId){
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null; //if I dont check everytime I will be creating a new product (without id), then an id will be generated, and therefore I will always be jumbing in the update product condition bellow
    this.userId = userId;
  }


  save(){
    const db = getDb();
    let dbOp;
    if (this._id){
      //Update the product
      dbOp = db.collection('products').updateOne({_id: this.id }, {$set:this});
    }else{
      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp
    .then(result => console.log( result))
    .catch(err => console.log(err))
  }

  static fetchAll(){
    const db = getDb();
    return db.collection('products').find().toArray()
    .then(products => {
      console.log(products);
      return products;
    })
    .catch(err => console.log(err))
  }

  static findById(prodId){
    const db = getDb();
    return db.collection('products').find({ _id: new mongodb.ObjectId(prodId)} ).next()
    .then(product => {
      return product;
    })
    .catch(err => console.log(err))
  }


  static deleteById(prodId){
    const db = getDb();
    return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId)} )
    .then(result  => {
      console.log('Deleted...!');
    })
    .catch(err => console.log(err))
  }


}

module.exports = Product;
