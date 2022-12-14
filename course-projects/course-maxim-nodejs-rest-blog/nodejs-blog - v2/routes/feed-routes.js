const express  = require('express');
const router = express.Router();
const {body} = require('express-validator/check')
const feedController = require('../controllers/feed-controller');
const isAuth = require('../middleware/is-auth');

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

router.post('/post', isAuth, [
    body('title').trim().isLength({min:7}),
    body('content').trim().isLength({min:5})
],
feedController.createPost);


router.get('/post/:postId', isAuth, feedController.getPostById);

router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({min:7}),
    body('content').trim().isLength({min:5})
], 
feedController.updatePost);


router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router ;
