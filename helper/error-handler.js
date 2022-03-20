function errorHandler(err, req, res, next) {
    if(err.name === "UnauthorizedError"){
        //in case of a JWT error
        return res.status(401).json({message: "The user is not authorized"})
    }

    if(err.name === "ValidationError"){
        // in case of a validation error
        return res.status(401).json({message: err})   
    }

    //default internal server error
    return res.status(500).json(err); 
}   

module.exports = errorHandler;              //https://stackoverflow.com/questions/70977308/typeerrorapp-use-requires-a-middleware-function