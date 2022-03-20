//Writing data to the cloud using Express, Bodyparser,
//Moongoose, Morgan and MongoDB. Follow the comments for more
//information. Enjoy the MERN (vidwatkanade2022)

const express  = require("express");
const app = express();
//const bodyParser = require('body-parser')
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helper/jwt");            //algorithm specified for token creation
const errorHandler = require("./helper/error-handler")

app.use(cors());
app.options("*", cors())

//Routes
const productsRoutes = require("./router/products");
const categoriesRoutes = require("./router/categories");
const userRoutes = require("./router/users");
const orderRoutes = require("./router/orders");
const path = require("path");


//middleware
app.use(bodyParser.json());
require("dotenv").config({path: "./node_modules/.env"});  //to use .env from the nodemodules(do not forget to specify the)
app.use(morgan("tiny")); 
app.use(authJwt);
app.use(errorHandler);
app.use("/public/uploads", express.static(path.join(__dirname + "/router/public/uploads")));  

const api = process.env.API_URL;
const Product = require("./models/product");

//routers
app.use(`/${api}/products`, productsRoutes);
app.use(`/${api}/categories`, categoriesRoutes);
app.use(`/${api}/users`, userRoutes);
app.use(`/${api}/orders`, orderRoutes);

 
mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,     //used to search for servers
    dbName: "eshop"
})

.then(()=>{
    console.log("Database connection is ready!")
})
.catch((err)=>{
    console.log("There is an error")
})

app.listen(3000, () => {
    console.log(process.env.API_URL);
    console.log("The server is running now http://localhost:3000")
});     //listen to the port and specify the port