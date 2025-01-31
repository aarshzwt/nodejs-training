const db = require("../models")
const { User, UserProfile, UserImage } = db

const validateId = (req, res, next) => {
    const id = req?.params?.id ?? req?.params?.userId;
    if (!id) {
        return res.status(403).json({ error: "User ID is required." });
    } else {
        regex = /^\d+$/;
        if (!regex.test(id)) {
            return res.status(400).json({ error: `id not valid. It must be positive integer!!` });
        }

        const user = User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: `No user found with id: ${id}.` })
        }
        else {
            next();
        }
    }
}

module.exports = validateId;