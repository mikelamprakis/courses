const { default: mongoose } = require("mongoose");

const channellchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    listOfSubscriber: {
        type: Array, 
        required: true
    }
})

module.exports = mongoose.model('Chanell', subscriberSchema)