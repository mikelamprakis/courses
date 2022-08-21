const express  = require('express');
const router = express.Router();
const {body} = require('express-validator/check')
const feedController = require('../controllers/feed-controller');


// GET /feed/posts
router.get('/posts', feedController.getPosts);

router.post('/post', [
    body('title').trim().isLength({min:7}),
    body('content').trim().isLength({min:5})
],
feedController.createPost);


router.get('/post/:postId', feedController.getPostById);

router.put('/post/:postId', [
    body('title').trim().isLength({min:7}),
    body('content').trim().isLength({min:5})
], 
feedController.updatePost);


router.delete('/post/:postId', feedController.deletePost)

module.exports = router ;
