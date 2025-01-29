const fs = require('fs');
const path = require('path');
const pool = require("../database/connection")

function welcome(req, res) {
  return res.status(200).json({ message: "Welcome to the User Management API!" });
}

// GET "/users" controller function
async function getUsers(req, res) {
  try {
    const result = await pool.query('SELECT * from users');
    const users = result[0];
    if (users.length !== 0) {
      let { ageGt, role, isActive } = req?.query;

      let filteredUsers = users;
      if (role) {
        filteredUsers = filteredUsers.filter((user) => user.role === role);
      }
      if (isActive) {
        filteredUsers = filteredUsers.filter((user) => String(user.isActive) === isActive);
      }
      if (ageGt) {
        filteredUsers = filteredUsers.filter((user) => user.age > parseInt(ageGt));
      }
      return res.status(200).json({ users: filteredUsers });
    }
    else {
      return res.status(404).json({ message: "No users found." });
    }
  } catch (error) {
    console.error(error);
  }
}

// GET "/users/:id" controller function
async function getUserById(req, res) {
  try {
    const id = parseInt(req.params.id);

    const query = ` SELECT 
      u.id, u.name, u.email, u.age, u.role, u.isActive, p.bio, p.linkedInUrl, p.facebookUrl, p.instaUrl, i.imageName from users u LEFT JOIN user_profiles p ON u.id = p.userId
      LEFT JOIN user_images i ON u.id = i.userId
      WHERE u.id = ?;` ;
    const result = await pool.query(query, [id]);
    const foundUser = result[0];
    if (foundUser.length != 0) {
      return res.status(200).json(foundUser);
    }
    else {
      return res.status(404).json({ message: `No user found with id: ${id}.` })
    }
  } catch (error) {
    console.error(error);
  }
}

// PUT "/users" controller function
async function createUser(req, res) {
  try {
    let { name, email, age, role, isActive } = req.body;
    isActive = Boolean(isActive);

    const emailValidation = await pool.query(`SELECT * from users where email=?`, [email]);
    const foundUser = emailValidation[0];
    if (foundUser.length != 0) {
      return res.status(400).json({ message: `User already exists with this email Id: ${email}.` })
    }

    else {
      const user = [name, email, age, role, isActive];
      console.log("Inserting user:", user);
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, age, role, isActive) VALUES (?,?,?,?,?)`,
        user
      );

      console.log("User created successfully:", result);
      return res.status(200).json({ message: "User created successfully", data: result });
    }
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

// PATCH "/users/:id" controller function
async function updateUser(req, res) {
  const id = parseInt(req.params.id);
  let { name, email, age, role, isActive } = req?.body;

  if (!name && !email && !age && !role && isActive === undefined) {
    return res.status(403).json({ error: `Atleast 1 query param is required from these: "name", "email", "age", "role", "isActive". ` });
  }

  if (email) {
    const emailValidation = await pool.query(`SELECT * from users where email=?`, [email]);
    const foundUser = emailValidation[0];
    if (foundUser.length != 0) {
      return res.status(400).json({ message: `Can not update User, email already exists: ${email}.` })
    }
  } else {
    const result = await pool.query(`SELECT * from users where id=?`, [id]);
    const foundUser = result[0];

    if (foundUser.length !== 0) {
      const update = req.body;
      const query = "Update users SET " + Object.keys(update).map(key => `${key} = ?`).join(", ") + " WHERE id = ?";
      const parameters = [...Object.values(update), id];

      const updateResult = await pool.query(query, parameters);
      console.log(updateResult[0]);
      if (updateResult[0].affectedRows > 0) {
        const updatedUser = await pool.query(`SELECT * FROM users WHERE id=?`, [id]);
        return res.status(200).json({
          message: "User Updated Successfully",
          data: updatedUser[0]
        });
      } else {
        return res.status(500).json({ message: "Error updating the user." });
      }
    } else {
      return res.status(404).json({ message: `No user found with id: ${id}.` })
    }
  }
}

// DELETE "/users/:id" controller function
async function deleteUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(403).json({ error: "Please enter user id to proceed." });
    }
    else {
      const result = await pool.query(`SELECT * from users where id=?`, [id]);
      const foundUser = result[0];
      if (foundUser.length != 0) {
        const result = await pool.execute(`DELETE FROM users WHERE id=?`, [id]);
        return res.status(200).json({ message: "User Deleted Successfully" });
      }
      else {
        return res.status(404).json({ message: `No user found with id: ${id}.` })
      }
    }
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

//POST "file-upload" controller function
async function fileUpload(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(403).json({ error: "Please enter user id to proceed." });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = req.file.originalname;
    const filePath = `/uploads/${req.file.fieldname}s/${req.file.filename}`; 
    const mimeType = req.file.mimetype;
    const extension = path.extname(req.file.originalname);
    const size = req.file.size;

    let query;
    let parameters;

    if (extension === ".pdf") {
      const { name, email, age } = req.body;
      query = "INSERT INTO user_pdfs (userId, name, email, age, pdfName, path, mimeType, extension) VALUES (?,?,?,?,?,?,?,?)";
      parameters = [id, name, email, age, fileName, filePath, mimeType, extension, size];
      await pool.query(query, parameters);
      return res.json({
        message: 'Pdf uploaded successfully',
      });
    }
    query = "INSERT INTO user_images (userId, imageName, path, mimeType, extension, size) VALUES (?,?,?,?,?,?)";
    parameters = [id, fileName, filePath, mimeType, extension, size];
    await pool.query(query, parameters);
    return res.json({
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Database error: ' + error.message });
  }

}


//USER_PROFILE SECTION

// GET "/user-profile/:id" controller function
async function getUserProfileById(req, res) {
  try {
    const id = parseInt(req.params.id);

    const result = await pool.query(`SELECT * from user_profiles where id=?`, [id]);
    const foundUser = result[0];
    if (foundUser.length !== 0) {
      return res.status(200).json(foundUser);
    }
    else {
      return res.status(404).json({ message: `No user found with id: ${id}.` })
    }
  } catch (error) {
    console.error(error);
  }
}

// POST "/user-profile/:id" controller function
async function createUserProfile(req, res) {
  try {
    const id = parseInt(req.params.id);
    let { bio, linkedInUrl, facebookUrl, instaUrl } = req.body;

    const existingUserProfile = await pool.query(`SELECT * from user_profiles where userId=?`, [id]);
    if (existingUserProfile[0].length !== 0) {
      return res.status(200).json({ message: `user Profile already exists with id: ${id}.` })
    }
    const user = [id, bio, linkedInUrl, facebookUrl, instaUrl];
    console.log("Inserting user:", user);
    const [result] = await pool.execute(
      `INSERT INTO user_profiles (userId, bio, linkedInUrl, facebookUrl, instaUrl) VALUES (?,?,?,?,?)`,
      user
    );

    const createdUserId = result.insertId;
    const selectQuery = 'SELECT userId, bio, linkedInUrl, facebookUrl, instaUrl FROM user_profiles WHERE id = ?';
    const [profile] = await pool.execute(selectQuery, [createdUserId]);
    return res.status(200).json({ message: "User created successfully", data: profile[0] });

  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

// PUT "/user-profile/:id" controller function
async function updateUserProfile(req, res) {
  const id = parseInt(req.params.id);
  let { bio, linkedInUrl, facebookUrl, instaUrl } = req?.body;

  const foundUser = await pool.query(`SELECT * from user_profiles where id=?`, [id]);
  if (foundUser[0].length !== 0) {
    const query = "UPDATE user_profiles SET bio=?, linkedInUrl=?, facebookUrl=?, instaUrl=? WHERE id = ?";
    const parameters = [bio, linkedInUrl, facebookUrl, instaUrl, id];

    const updateResult = await pool.query(query, parameters);
    console.log(updateResult[0]);
    if (updateResult[0].affectedRows > 0) {
      const updatedUser = await pool.query(`SELECT * FROM user_profiles WHERE id=?`, [id]);
      return res.status(200).json({
        message: "User Updated Successfully",
        data: updatedUser[0]
      });
    } else {
      return res.status(500).json({ message: "Error updating the user." });
    }
  } else {
    return res.status(404).json({ message: `No user found with id: ${id}.` })
  }

}

// DELETE "/user-profile/:id" controller function
async function deleteUserProfile(req, res) {
  try {
    const id = parseInt(req.params.id);

    const foundUser = await pool.query(`SELECT * from user_profiles where id=?`, [id]);
    if (foundUser[0].length !== 0) {
      const result = await pool.execute(`DELETE FROM user_profiles WHERE id=?`, [id]);
      return res.status(200).json({ message: "User Deleted Successfully" });
    }
    else {
      return res.status(404).json({ message: `No user found with id: ${id}.` })
    }
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

// DELETE "/user-images/:id" controller function
async function deleteUserImages(req, res) {
  try {
    const userId = parseInt(req.params.userId);
    if (!userId) {
      return res.status(403).json({ error: "Please enter userId to proceed." });
    }
    else {
      const result = await pool.query(`SELECT * from user_images where userId=?`, [userId]);
      const foundUser = result[0];
      if (foundUser.length != 0) {
        const result = await pool.execute(`DELETE FROM user_images WHERE userId=?`, [userId]);
        return res.status(200).json({ message: "User Deleted Successfully" });
      }
      else {
        return res.status(404).json({ message: `No user found with userId: ${userId}.` })
      }
    }
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
  getUserProfileById,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  deleteUserImages
};