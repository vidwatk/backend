const {User} = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res)=>{
    const userList = await User.find().select('-passwordHash');        //(name phone email) removed

    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})

//GETTING ONE USER
router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user) {
        res.status(500).json({message: "The category you are looking for does not exist"})
    }
    res.status(200).send(user);
})

router.post("/", async (req, res) => {     //req gets info from the front end and the res is used to read them
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country       

    })
    user = await user.save();

    if(!user)
    return res.status(404).send("The user cannot be registered")

    res.send(user);
})

//REGISTER
router.post("/register", async (req, res) => {     //req gets info from the front end and the res is used to read them
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country       

    })
    user = await user.save();

    if(!user)
    return res.status(404).send("The user cannot be registered")

    res.send(user);
})

router.post("/login", async (req,res) => {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.secret;
    if(!user){
        return res.status(400).send("User not found")
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '20d'}
        )
        res.status(200).send({user: user.email, token: token})
    }else {
        res.status(400).send("Wrong password entered")
    }
})

//get count of all the users
router.get("/get/count", async (req, res)=>{
    let count;
    const userCount = await User.countDocuments({count: count})
    if(!userCount){
        res.status(500).json({success: false})
    }
    res.send({ User_Count: userCount });
})

//DELETE A USER
router.delete("/:id", (req, res) =>{
    User.findByIdAndRemove(req.params.id).then(user => {
        if(user) {
            return res.status(200).json({success:true, message: "User is deleted"})
        }else{
            return res.status(404).json({success:false, message: "You are fucked cause this does not exist"})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;