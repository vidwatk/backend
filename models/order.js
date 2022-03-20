const mongoose = require("mongoose");

//Schema
const orderSchema = mongoose.Schema({
    orderItems: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: "OrderItem",
       required: true,
   }],
   shippingAddress1: {
       type: String,
       required: true,
   },
   shippingAddress2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    },
    totalPrice: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    }

})

orderSchema.virtual("id").get(function (){            //creating a virtual id
    return this._id.toHexString();                      //getting the virtual id from _id para in MongoDB
});

orderSchema.set("toJSON", {               
    virtuals: true,     
});

//Model
exports.Order = mongoose.model("Order", orderSchema);