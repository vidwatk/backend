const mongoose = require("mongoose");

//Schema
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    colour: {
        type: String
    } 
    
})

//Model
exports.Category = mongoose.model("Category", categorySchema);