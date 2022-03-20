const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();       //comes with express
const {Product} = require("../models/product")
const mongoose = require("mongoose");
const multer = require("multer");

//MIME TYPE LOOKUP
const FILE_TYPE_MAP = {
    "image/png" : "png",
    "image/jpeg" : "jpeg",
    "image/jpg" : "jpg"
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error("invalid Image Format");
        if(isValid){
            uploadError = null;
        }
      cb(uploadError, __dirname + '/public/uploads')
    },
    filename: function (req, file, cb) {//const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extension = FILE_TYPE_MAP[file.mimetype]
        const fileName = file.originalname.split(" ").join("_");
      cb(null,  Date.now() + "-" + fileName )
    }
  })
  
  const uploadOptions = multer({ storage: storage })

//SINGLE UPLOADS
router.post(`/`, uploadOptions.single("image"), async (req, res)=>{

    let category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send("What the fuck? Invalid category");
    
    const file = req.file;
    if(!file) return res.status(400).send("What the fuck? I need a file");         //compulsary image file upload similar for the category
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,//"http://localhost:3000/public/upload/image-213213"
        //images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })
    product1 = await product.save();
    if(!product1)
    return res.status(500).send("The product cannot be created");

    res.send(product1);
})  

//TO UPDATE THR GALLERY IMAGES ONLY

router.put(
    "/gallery-images/:id",
    uploadOptions.array('images', 8),
    async (req, res) => {
        if(!mongoose.isValidObjectId(req.params.id)){
            res.status(400).send("Invalid product id")
        }
        
        const files = req.files
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

        if(files){
            files.map(file => {
                imagesPaths.push(`${basePath}${file.filename}`);
                //console.log(imagePaths)
            })
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new : true}
        )
        
        if(!product)
            return res.status(404).send("The product cannot be updated")

        res.send(product);

})

// /api/v1
router.get(`/`, async (req, res)=>{
    let filter = {};    //an empty object

    if (req.query.categories){
        filter = {category: req.query.categories.split(', ')}    //empty object will have value when params are added
    }

    const productList = await Product.find({ filter })//.select("name image -_id"); //required params

    if(!productList){
        res.status(500).json({success: false})
    }
    res.send(productList);
})

//getting by ID
router.get(`/:id`, async (req, res)=>{
    const product = await Product.findById(req.params.id).populate("category");  //populate displays the category specs
    if(!product){
        res.status(500).json({success: false})
    }
    res.send(product);
})


// DELETING A CATEGORY
router.delete("/:id", (req, res) =>{
    Product.findByIdAndRemove(req.params.id).then(product => {
        if(product) {
            return res.status(200).json({success:true, message: "Product is deleted"})
        }else{
            return res.status(404).json({success:false, message: "You are fucked cause this does not exist"})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

//updating the products
router.put("/:id", async (req, res) => {
    if(mongoose.isValidObjectId(req.params.id)){
        res.status(400).send("Invalid product id")
    }

    let category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send("What the fuck? Invalid category");

    const product = await Product.findByIdAndUpdate(
        req.params.id, 
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        { new: true }
    )
    if(!product)
    return res.status(404).send("The product cannot be updated")

    res.send(product);
})


//GET COUNT OF ALL THE PRODUCTS
router.get("/get/count", async (req, res)=>{
    let count;
    const productCount = await Product.countDocuments({count: count})
    if(!productCount){
        res.status(500).json({success: false})
    }
    res.send({ Product_count: productCount });
})

//GET FEATURED PRODUCTS ONLY
router.get(`/get/featured/:count`, async (req, res)=>{
    let count =req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(count)
    if(!products){
        res.status(500).json({success: false})
    }
    res.send({ products });
})

module.exports = router;


