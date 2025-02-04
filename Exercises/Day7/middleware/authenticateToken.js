const jwt = require('jsonwebtoken')
require('dotenv').config();

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    if(!authHeader){
        return res.status(401).json({ message: 'no token provided'});
    }
    console.log(authHeader)
    const token = authHeader.split(' ')[1]

    if(!token){
       return res.status(401).json({ message: 'no token provided'});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({ message: 'Token is not valid, authorization denied.'})
        }
        req.user = user;
        next();
    })
}

module.exports = {authenticateToken}