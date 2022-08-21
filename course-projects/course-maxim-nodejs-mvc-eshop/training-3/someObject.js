const { default: mongoose } = require("mongoose");

const someObjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    someDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('SomeObject', someObjectSchema)