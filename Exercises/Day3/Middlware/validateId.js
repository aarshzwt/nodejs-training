const users = require("../../../constant")

const validateId = (req, res, next) => {
    const id = req?.params?.id;
    regex=/^\d+$/;
    if(!regex.test(id)){
        return res.status(400).json({error:`id not valid. It must be positive integer!!`});
    }
    else{
        const foundUser = users.find((user) => String(user.id) === id);
        if (!foundUser) {
            return res.status(400).json({error:`Could not find any user with id: ${id}`});
        }
        else {
            next();        
        }
    }
}

module.exports = validateId;