const express = require('express');
const router = express.Router();
const SomeObject = require('./someObject')

// POST
router.post('/new', async (req, res)=>{
    const someObject = new SomeObject({
        name: req.body.name
    })
    try{
        const savedObject = await someObject.save();
        res.status(201).json(savedObject);
    }catch(err){
        res.status(400).json({message: err.message})
    }
    
})

module.exports = router;