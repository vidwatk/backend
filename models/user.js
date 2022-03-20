const mongoose = require("mongoose");

//Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    street: {
        type: String,
        default: ""
    },
    apartment: {
        type: String,
        default: ""
    },
    zip: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: "",
    },
    country: {
        type: String,
        default: ""
    }
})

userSchema.virtual("id").get(function (){            //creating a virtual id
    return this._id.toHexString();                      //getting the virtual id from _id para in MongoDB
});

userSchema.set("toJSON", {               
    virtuals: true,     
});

//Model
exports.User = mongoose.model("User", userSchema);