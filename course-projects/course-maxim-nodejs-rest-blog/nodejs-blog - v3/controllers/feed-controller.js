const {validationResult} = require('express-validator/check') 
const fs = require('fs');
const path = require('path');
const io = require('../socket');
const Post = require('../model/post');
const User = require('../model/user');


exports.getPosts = (req, res, next ) => {
    const currentPage = req.query.page || 1;
    const postsPerPage = 2;

    Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Post.find()
        .populate('creator')
        .sort({createdAt: -1})
        .skip((currentPage - 1) * postsPerPage)
        .limit(postsPerPage);
    })
    .then(posts => {
        console.log(posts);
        res.status(200).json({
            message:'Fetched posts successfully', 
            posts:posts,
            totalItems: totalItems
        })
    })
    .catch(err => {
        if (!err.statusCode){
            err.statuscode= 500
        }
        next(err);
    })
    // res.status(200).json({
    //     posts: [{_id:'1', title:'First title', content: 'Some content', imageUrl:'images/pic.png', creator:{name:'Mike'}, createdAt: new Date() }]
    // })
}

exports.getPostById = (req, res, next ) => {
    const postId = req.params.postId;

    Post.findById(postId)
    .then(singlePost => {
        if (!singlePost){
            const error = new Error('Could not find post');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            message: 'Post Fetched !', 
            post: singlePost
        })
    })
    .catch(err => {
        if (!err.statusCode){
            err.statuscode= 500
        }
        next(err);
    })
}



exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const error = new Error('Validation failed, enterd data is not correct')
        error.statuscode = 422;
        throw error; 
    }
    if (!req.file){
        const error = new Error('No iamge provided');
        error.statusCode = 422;
        throw error;
    }

    console.log('---->>');
    console.log(req.file);
    const imageUrl =  req.file.path.split("\\").join("/");
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId, //stored in token
    })
    console.log(post);
    post.save()
    .then(result => {
        return User.findById(req.userId);
    })
    .then(user => {
        creator = user;
        user.posts.push(post);
        return user.save();
    })
    .then(result => {
        io.getIO().emit('posts', {
            action: 'create',
            post: { ...post._doc, creator: { _id: req.userId, name: creator.name } }
          });
        res.status(201).json({
            message: 'Post created successfully',
            post: post,
            creator : {_id: creator._id, name: creator.name}
        })
    })
    .catch(err => {
        console.log(err);
        if (!err.statusCode){
            err.statuscode= 500
        }
        next(err);
    })
}


exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
console.log('----1');
    if (!errors.isEmpty()){
        const error = new Error('Validation failed, enterd data is not correct')
        error.statuscode = 422;
        throw error; 
    }
  console.log('----2');
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image || 'empty';

    if (req.file){

        imageUrl = req.file.path.trim().split("\\").join("/");
    }
    if (!imageUrl){
        const error = new Error('No file picke!');
        error.statusCode = 422;
        throw error;
    }
    console.log('-----5');
    
    Post.findById(postId)
    .populate('creator')
    .then(post => {
        if (!post){
            const error = new Error('Could not find post');
            error.statusCode = 404;
            throw error;
        }
        // prevent other users from editing other people's posts
        if (post.creator._id.toString() !== req.userId){
            const error = new Error('Not authorized..');
            error.statusCode = 403;
            throw error;
        }
        console.log('----6');

        // If we are updating the image, the previous is deleted for housekeeping purposes
        if (imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        console.log('----7');

        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        console.log('----8');
        return post.save();
    })
    .then(result => {
        io.getIO().emit('posts', {action: 'update', post:result})
        console.log('-----');
        console.log(result);
        res.status(200).json({message:'Post Updated', post: result})
    })
    .catch(err => {
        console.log(err);
        if (!err.statusCode){
            err.statuscode= 500
        }
        next(err);
    })


}


exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if (!post){
            const error = new Error('Could not find post..');
            error.statusCode = 404;
            throw error; 
        }
        // prevent other users from deleting other people's posts
        if (post.creator.toString() !== req.userId){
            const error = new Error('Not authorized..');
            error.statusCode = 403;
            throw error;
        }
        // check logged in user
        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(postId);
    })
    .then(result => {
        return User.findById(req.userId);
    })
    .then(user => {
        user.posts.pull(postId);
        return user.save();
    })
    .then(result => {
        io.getIO().emit('posts', {action:'delete', post: postId});
        console.log(result);
        res.status(200).json({message: 'Deleted post'});
    })
    .catch(err => {
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })

}



const clearImage = filePath => {
    filePath = path.join(__dirname, "../", filePath);
    fs.unlink(filePath, err => console.log(err));
}