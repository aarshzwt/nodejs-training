// const users = require("../../../constant")
const pool = require("../database/connection")

const validateId = (req, res, next) => {
    const id = req?.params?.id ?? req?.params?.userId;
    if(!id){
        return res.status(403).json({ error: "User ID is required." });
    }else{
        regex=/^\d+$/;
        if(!regex.test(id)){
            return res.status(400).json({error:`id not valid. It must be positive integer!!`});
        }
        // const foundUser = users.find((user) => String(user.id) === id);
        const foundUser= pool.query (`SELECT * from users where id=?`,[id])
        if (!foundUser) {
            return res.status(400).json({error:`Could not find any user with id: ${id}`});
        }
        else {
            next();        
        }
    }  
}

module.exports = validateId;