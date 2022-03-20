const {Order} = require("../models/order");
const express = require("express");
const { OrderItem } = require("../models/order-item");
const router = express.Router();

router.get(`/`, async (req, res)=>{
    const orderList = await Order.find().populate("user", "name").sort({"dateOrdered": -1});  //check out sort methods docs

    if(!orderList) {
        res.status(500).json({success: false})
    }
    res.send(orderList);
})

//GETTING ORDERS BY ID
router.get(`/:id`, async (req, res)=>{
    const order = await Order.findById(req.params.id)
    .populate("user", "name")                       //getting the user information inside the order details
    //.populate("orderItems");                        //getting the product details inside the order details
    .populate({ 
        path: "orderItems",
        populate: {path: "product", populate: "category"} 
    })

    if(!order) {
        res.status(500).json({success: false})
    }
    res.send(order);
})

router.post("/", async (req, res) => {     //req gets info from the front end and the res is used to read them
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
        
    }));
    const orderItemsIdsResolved = await orderItemsIds;
    //console.log(orderItemsIds);
    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=> {
        const orderItem = await OrderItem.findById(orderItemId).populate("product", "price");
        const totalPricex = orderItem.product.price * orderItem.quantity;
        return totalPricex
    }))

    const totalPrice = totalPrices.reduce((a,b) => a+b, 0);
    //console.log(totalPricex)

    let order = new Order({
        orderItems: orderItemsIdsResolved,         //not getting it from the body as they come from the created orderitems
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
        order = await order.save();

    if(!order)
    return res.status(404).send("The order cannot be created")

    res.send(order);
})

//UPDATE THE PENDING STATUS OF THE ORDERS
router.put("/:id", async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id, 
        {
            status: req.body.status
        },
        { new: true }
    )
    if(!order)
    return res.status(404).send("The order cannot be updated")

    res.send(order);
})

//DELETING AN ORDER BY ID
router.delete('/:id', async (req, res) => {
    try {
      const order = await Order.findByIdAndRemove(req.params.id)
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        })
      }
  
      await OrderItem.deleteMany({ _id: { $in: order.orderItems } })
  
      res.json({
        success: true,
        message: 'Your order is deleted',
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err,
      })
    }
  })

//DELETING AN ORDER BY ID OPTION 2
// router.delete("/:id", (req, res) => {
//     Order.findByIdAndRemove(req.params.id).then(async order => {
//         if(order){
//             await order.orderItems.map(async orderItem => {
//                 await OrderItem.findByIdAndRemove(orderItem)
//             })
//             return res.status(200).json({success: true, message: "order removed"})
//         }else {
//             return res.status(400).json({success: false, message: "delete failed"});
//         }
//     }).catch(err => {
//         return res.status(500).json({success: false, error: err})
//     })
// })

//TOTAL SALES
router.get("/get/totalsales", async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: {_id: null, totalsales: {$sum: "$totalPrice"}} }
    ])
    if(!totalSales){
        return res.status(400).send("The ordersales cannot be generated")
    }
    res.send({totalsales: totalSales.pop().totalsales})
})

//COUNT OF SALES
router.get("/get/count", async (req, res)=>{
    let count;
    const orderCount = await Order.countDocuments({count: count})
    if(!orderCount){
        res.status(500).json({success: false})
    }
    res.send({ Order_count: orderCount });
})

module.exports = router;