const expressJwt = require("express-jwt");
require("dotenv").config({path: "./node_modules/.env"}); 

function authJwt(){
    const secret = process.env.secret;  
    return expressJwt({
        secret,
        algorithms: ["HS256"],
        isRevoked: isRevoked                          //is admin or not
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },  //to be defined as static holder in middleware (app.js app.use(public/uploads))
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    })
}

async function isRevoked(req, payload, done){
    if(!payload.isAdmin){ 
        done(null, true)
    }
    done();
}

module.exports = authJwt();