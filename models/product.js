const mongoose = require("mongoose");

//Schema
const productSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ""
    },
    image:{
        type: String,
        default: ""
    }, 
    images: [{
        type: String,
    }],
    brand: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,     //basically a foreign key(from categories table)
        ref: "Category",
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255 
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }, 
    isFeatured: {
        type: Boolean,
        default: false
    }, 
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

productSchema.virtual("id").get(function (){            //creating a virtual id
    return this._id.toHexString();                      //getting the virtual id from _id para in MongoDB
});

productSchema.set("toJSON", {               
    virtuals: true,     
});

//Model
exports.Product = mongoose.model("Product", productSchema);