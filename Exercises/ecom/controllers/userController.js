const db = require("../models")
const { User } = db
const bcrypt = require('bcrypt')

//GET all users controller function
async function getUsers(req, res) {
    try {
        //pagination details
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        const totalUsers = await User.count();

        const role = req?.query.role;

        //sorting based on column & order
        const order= req?.query.order || 'ASC';
        const col = req?.query.col || 'createdAt';

        //filter with role
        const filters= {
            ...(role) && {role:role}
        }
        const users = await User.findAll({
            where:filters,
            limit: limit,
            offset: offset,
            order: [[col, order]]
        });
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found." });
        }
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            users: users,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalUsers,
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }

}

//get User Profile controller function
async function getUserProfile(req, res) {
    try {
        const id = req.id;
        console.log(id)
        const user = await User.findOne({
            where: { id }
        });
        if (!user) {
            return res.status(404).json({ message: `No user found with id: ${id}.` });
        }
        return res.status(200).json({ user: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching the user." });
    }
}

//UPDATE user profile controller function
async function updateUserProfile(req, res) {
    try {
        const id = req.id;
        const updateData = req.body;

        if (updateData.length === 0) {
            return res.status(400).json({
                message: "Atleast one param is required from [first_name, last_name, email, password].",
            });
        }

        // Check if 'role' is present in the request body and return error if found
        if (updateData.role) {
            return res.status(400).json({
                message: "Cannot update role.",
            });
        }
        //if password is to be updated hash it before storing the updated password in db
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 13);
        }
        const [affectedRows] = await User.update(updateData,
            {
                where: { id },
            });
        if (affectedRows > 0) {
            const updatedUserProfile = await User.findOne({ where: { id } });
            return res.status(200).json({
                message: "User Updated Successfully",
                data: updatedUserProfile,
            });
        } else {
            return res.status(500).json({ message: "Error updating the user profile." });
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: `Email address already exists. Please choose a different email.`,
            });
        }
        console.log(error);
        return res.status(500).json({ message: "An error occurred while updating the user." });

    }
}

module.exports = { getUsers, getUserProfile, updateUserProfile }