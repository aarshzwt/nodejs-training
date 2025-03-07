const fs = require('fs');
const path = require('path')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const db = require("../models")
const { User, UserProfile, UserImage } = db


function welcome(req, res) {
  return res.status(200).json({ message: "Welcome to the User Management API!" });
}

// GET "/users" controller function
async function getUsers(req, res) {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    let { ageGt, role, isActive } = req?.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const order= req?.query.order || 'ASC';
    const col = req?.query.col || 'createdAt';

    const filters = {};
    if (role) {
      filters.role = role;
    }
    if (isActive) {
      filters.isActive = isActive === 'true';
    }
    if (ageGt) {
      filters.age = { [db.Sequelize.Op.gt]: parseInt(ageGt, 10) };
    }

    const { rows, count } = await User.findAndCountAll({
      where: filters,
      limit: limit,
      offset: offset,
      order: [[col, order]]
    });
    if (count === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      users: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  }
  catch (error) {
    console.error(error);
  }
}

// GET "/users/:id" controller function
async function getUserById(req, res) {
  try {
    const id = parseInt(req.params.id);

    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: UserProfile,
          attributes: ['bio', 'linkedInUrl', 'facebookUrl', 'instaUrl'],
        },
        {
          model: UserImage,
          as: 'UserImages',
          attributes: ['imageName', 'path', 'mimeType', 'extension', 'size'],
        },
      ],
    });


    if (!user) {
      return res.status(404).json({ message: `No user found with id: ${id}.` });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        role: user.role,
        isActive: user.isActive,
        profile: user.UserProfile,
        images: user.UserImages,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while fetching the user." });
  }
}


// POST "/users" controller function
async function createUser(req, res) {
  try {
    let { name, email, password, age, role, isActive } = req.body;
    isActive = Boolean(isActive);
   
    const user = await User.create({ name, email, password, age, role, isActive });
    return res.status(200).json({ message: "User created successfully", data: user });
  }
  catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: `Email address already exists. Please choose a different email.`,
      });
    }
    return res.status(500).json({ error: error });

  }
}

// PATCH "/users/:id" controller function
async function updateUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: `At least one field (e.g., "name", "email", "password", "age", "role", "isActive") is required to update.`,
      });
    }
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: `No user found with id: ${id}.` })
    }
    const [affectedRows] = await User.update(updateData,
      {
        where: { id },
      });
    if (affectedRows > 0) {
      const updatedUser = await User.findOne({ where: { id } });
      return res.status(200).json({
        message: "User Updated Successfully",
        data: updatedUser,
      });
    } else {
      return res.status(500).json({ message: "Error updating the user." });
    }

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: `Email address ${error} already exists. Please choose a different email.`,
      });
    }
    return res.status(500).json({ error: error });
  }
}

// DELETE "/users/:id" controller function
async function deleteUser(req, res) {
  try {
    const id = parseInt(req.params.id);

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: `No user found with id: ${id}.` })
    }
    await User.destroy({ where: { id } });
    return res.status(200).json({ message: "User deleted Successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ error: error });
  }
}

async function fileUpload(req, res) {
  try {
    const userId = parseInt(req.params.userId);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const nonExistingUser = await User.findOne({
      where: {
        id: userId,
      }
    });
    if (!nonExistingUser) {
      return res.status(400).json({ message: `Can not upload images of non existent user.` })
    }
    const imageName = req.file.originalname;
    const filePath = `/uploads/${req.file.filename}`;
    const mimeType = req.file.mimetype;
    const extension = path.extname(req.file.originalname);
    const size = req.file.size;

    const imgData = await UserImage.create({ userId, imageName, path: filePath, mimeType, extension, size });
    return res.status(200).json({ message: "Image uploaded successfully", data: imgData });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Something went wrong!' });
  }
}


//LOGIN ROUTE
async function userLogin(req, res) {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({
      where:{
        email
      }
    });
    if(!user){
      return res.status(404).json({ message: " User doesn't exists with this email"})
    }
    const isValid = await user.comparePassword(password);
    
    if(!isValid){
      return res.status(400).json({ message: "Please enter the correct password"})
    }
    const payload = {
      userId: user.id,
      email: user.email
    };
    
    const accessToken= jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
    return res.status(200).json({ message: "Login Successfull.", accessToken: accessToken
    })

  } catch (error) {
    return res.status(500).json({ error: error })
  }
}




//USER_PROFILE SECTION

// GET "/user-profile/:id" controller function
async function getUserProfileById(req, res) {
  try {
    const id = parseInt(req.params.id);

    const user_profile = await UserProfile.findOne({
      where: {
        id,
      },
    });
    if (!user_profile) {
      return res.status(404).json({ message: `No user profile found with id: ${id}.` })
    }
    return res.status(200).json({ user_profile: user_profile });

  } catch (error) {
    console.error(error);
  }
}

// POST "/user-profile/:id" controller function
async function createUserProfile(req, res) {
  try {
    const userId = parseInt(req.params.userId);

    let { bio, linkedInUrl, facebookUrl, instaUrl } = req.body;

    const existingUserProfile = await UserProfile.findOne({
      where: {
        userId,
      },
    });
    if (existingUserProfile) {
      return res.status(400).json({ message: `user Profile already exists with id: ${userId}.` })
    }
    const nonExistingUser = await User.findOne({
      where: {
        id: userId,
      }
    });
    if (!nonExistingUser) {
      return res.status(400).json({ message: `Can not create user Profile of non existent user.` })
    }
    const user_profile = await UserProfile.create({ userId, bio, linkedInUrl, facebookUrl, instaUrl });
    return res.status(200).json({ message: "User Profile created successfully", data: user_profile });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

// PUT "/user-profile/:id" controller function
async function updateUserProfile(req, res) {
  try {
    const id = parseInt(req.params.id);

    const updateData = req.body;

    const existingUserProfile = await UserProfile.findOne({ where: { id } });
    if (existingUserProfile.length === 0) {
      return res.status(404).json({ message: `No user profile found with id: ${id}.` })
    }
    const [affectedRows] = await UserProfile.update(updateData,
      {
        where: { id },
      });
    if (affectedRows > 0) {
      const updatedUserProfile = await UserProfile.findOne({ where: { id } });
      return res.status(200).json({
        message: "User Updated Successfully",
        data: updatedUserProfile,
      });
    } else {
      return res.status(500).json({ message: "Error updating the user profile." });
    }
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

// DELETE "/user-profile/:id" controller function
async function deleteUserProfile(req, res) {
  try {
    const id = parseInt(req.params.id);
    const existingUserProfile = await UserProfile.findOne({ where: { id } });
    if (existingUserProfile.length === 0) {
      return res.status(404).json({ message: `No user profile found with id: ${id}.` })
    }
    else {
      await UserProfile.destroy({ where: { id } });
      return res.status(200).json({ message: "User Profile deleted Successfully" });
    }
  } catch (error) {
    console.error("Error in delete User Profile:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

// DELETE "/user-images/:userId" controller function
async function deleteUserImages(req, res) {
  try {
    const userId = parseInt(req.params.userId);

    const existingUserImages = await UserImage.findAll({ where: { userId } });
    if (existingUserImages.length === 0) {
      return res.status(404).json({ message: `No user Images found with userId: ${userId}.` })
    }
    await UserImage.destroy({ where: { userId } });
    return res.status(200).json({ message: "User Images deleted Successfully" });

  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}


module.exports = {
  welcome,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  fileUpload,
  userLogin,
  getUserProfileById,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  deleteUserImages
};