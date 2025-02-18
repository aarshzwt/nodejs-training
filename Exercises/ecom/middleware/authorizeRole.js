const jwt = require('jsonwebtoken')

//Role based Authorization middleware function
function authorizeRole(allowedRole) {
    return async(req, res, next) => {
        try{
            const authHeader = req.headers['authorization']
            if (!authHeader) {
                return res.status(401).json({ message: 'no token provided' });
            }
            const token = authHeader.split(' ')[1]
            if (!token) {
                return res.status(401).json({ message: 'no token provided' });
            }
            const decoder = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.id = decoder.id;
            req.role = decoder.role
            console.log(req.id, req.role);
            if(!allowedRole.includes(req.role)){
                return res.status(401).json({ message: 'Access Denied, failed to qualify the required role qualification.' });
            }
            next();
        }catch(error){
            console.log(error)
            return res.status(500).json({ error: error });
        }
    }
}

module.exports = {authorizeRole}