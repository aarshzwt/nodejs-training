const users = require("../constant")

const validateId = (req, res, next) => {
    const {id} = req.params;

    if(!(/^d+$/.test(id))){
        return res.status(400).json({error:`id not valid`});
    }
    else{
        const foundUser = users.find((user) => user.id === id);
        if (!foundUser) {
            return res.status(400).json({error:`Could not find any user with id: ${id}`});
        }
        else {
            next();        
        }
    }
}

module.exports = validateId;