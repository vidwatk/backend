const mongoose = require("mongoose");

//Schema
const orderItemSchema = mongoose.Schema({
    quantity: {
       type: Number,
       required: true,
   },
   product: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Product"
   }
})

//Model
exports.OrderItem = mongoose.model("OrderItem", orderItemSchema);
//module.exports = mongoose.models.OrderItem || mongoose.model("OrderItem", orderItemSchema);