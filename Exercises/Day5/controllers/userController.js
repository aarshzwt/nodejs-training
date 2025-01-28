const fs = require('fs');
const path = require('path');
const { validRoles } = require("../../../constant")
const emailValidator = require("../validators/emailValidator")
const ageValidator = require("../validators/ageValidator")
const roleValidator = require("../validators/roleValidator")
const pool = require("../database/connection")

function welcome(req, res) {
  return res.status(200).json({ message: "Welcome to the User Management API!" });
}

async function getUsers(req, res) {

  // if (users) {
  //   let { age, role, isActive } = req?.query;

  //   let filteredUsers = users;
  //   if (role) {
  //     filteredUsers = filteredUsers.filter((user) => user.role.toLowerCase() === role.toLowerCase());
  //   }
  //   if (isActive) {
  //     filteredUsers = filteredUsers.filter((user) => String(user.isActive) === isActive);
  //   }
  //   if (age) {
  //     filteredUsers = filteredUsers.filter((user) => user.age >= parseInt(age));
  //   }
  //   return res.status(200).json({ users: filteredUsers });
  // }
  // else {
  //   return res.status(404).json({ message: "No users found." })
  // }


  try {
    const result = await pool.query('SELECT * from users');
    const users = result[0];
    if (users.length != 0) {
      return res.status(200).json({ users: users });
    }
    else {
      return res.status(404).json({ message: "No users found." });
    }
  } catch (error) {
    console.error(error);
  }
}

async function getUserById(req, res) {

  try {
    const id = parseInt(req.params.id);

    const result = await pool.query(`SELECT * from users where id=?`, [id]);
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

async function createUser(req, res) {
  try {

    let { name, email, age, role, isActive } = req.body;
    isActive = Boolean(isActive);

    if (!name || !email || !role || isActive === undefined) {
      console.log("Missing parameters");
      return res.status(403).json({ error: "All parameters (name, email, age, role, isActive) are required" });
    }
    if (age === undefined || age === null || age === '') {
      console.log("Age not entered");
      return res.status(400).json({ error: "Age not entered" });
    }

    else if (!ageValidator(age)) {
      console.log("Invalid type of age");
      return res.status(400).json({ error: `Age not valid, it must be Interger number` });
    }

    else if (!roleValidator(role)) {
      return res.status(400).json({ error: `role must be from ["User", "Admin"]` });
    }

    else if (!emailValidator(email)) {
      console.log("Invalid email");
      return res.status(400).json({ error: `Email not valid` });
    }
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


async function updateUser(req, res) {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(403).json({ error: "User ID is required." });
  }
  let { name, email, age, role, isActive } = req?.body;

  if (!name && !email && !age && !role && isActive === undefined) {
    return res.status(403).json({ error: `Atleast 1 query param is required from these: "name", "email", "age", "role", "isActive". ` });
  }

  if (age) {
    if (!ageValidator(age)) {
      console.log("Invalid type of age");
      return res.status(400).json({ error: `Age not valid, it must be Interger number` });
    }
  }

  if (role) {
     if (!roleValidator(role)) {
      return res.status(400).json({ error: `role must be from ["User", "Admin"]` });
    }
  }

  if (email) {
    if (!emailValidator(email)) {
      console.log("Invalid email");
      return res.status(400).json({ error: `Email not valid` });
    } else {
      const emailValidation = await pool.query(`SELECT * from users where email=?`, [email]);
      const foundUser = emailValidation[0];
      if (foundUser.length != 0) {
        return res.status(400).json({ message: `Can not update User, email already exists: ${email}.` })
      }
    }
  }

  else {
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
      }
      else {
        return res.status(500).json({ message: "Error updating the user." });
      }
    }
    else {
      return res.status(404).json({ message: `No user found with id: ${id}.` })
    }

  }
}

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


async function fileUpload(req, res) {
  const id = parseInt(req.params.id);
  const imageName = req.file.originalname;
  const filePath = `/uploads/${req.file.filename}`;
  const mimeType = req.file.mimetype;
  const extension = path.extname(req.file.originalname);
  const size = req.file.size;
  if (!id) {
    return res.status(403).json({ error: "Please enter user id to proceed." });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const query = "INSERT INTO user_images (userId, imageName, path, mimeType, extension, size) VALUES (?,?,?,?,?,?)";
  const parameters = [id, imageName, filePath, mimeType, extension, size];
  const result = await pool.query(query, parameters);
  res.json({
    message: 'Image uploaded successfully',
    data: result
  });

}

module.exports = {
  welcome,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  fileUpload
};