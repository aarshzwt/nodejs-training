const multer = require('multer')
const fs = require('fs');
const path = require('path');
const { users, validRoles } = require("../../../constant")
const { emailValidator } = require("../validators/emailValidator");


function welcome(req, res) {
  return res.status(200).json({ message: "Welcome to the User Management API!" });
}

function getUsers(req, res) {
  if (users) {
    let { age, role, isActive } = req?.query;

    let filteredUsers = users;
    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role.toLowerCase() === role.toLowerCase());
    }
    if (isActive) {
      filteredUsers = filteredUsers.filter((user) => String(user.isActive) === isActive);
    }
    if (age) {
      filteredUsers = filteredUsers.filter((user) => user.age >= parseInt(age));
    }
    return res.status(200).json({ users: filteredUsers });
  }
  else {
    return res.status(404).json({ message: "No users found." })
  }
}

function getUserById(req, res) {
  const id = parseInt(req.params.id);

  const foundUser = users.find((user) => user.id === id);
  if (foundUser) {
    return res.status(200).json(foundUser);
  }
  else {
    return res.status(404).json({ message: `No user found with id: ${id}.` })
  }
}

function createUser(req, res) {
  let { name, email, age, role, isActive } = req.body;
  age = parseInt(age);
  isActive = Boolean(isActive);
  // console.log(name, email, age, role, isActive);

  if (!name || !email || !age || !role || isActive === undefined) {
    return res.status(403).json({ error: "All parameters (name, email, age, role, isActive) are required" });
  }
  else if (!emailValidator(email)){
    return res.status(400).json({error:`email not valid`});
  }

  const emailValidation = users.find((user) => user.email === email)
  if (emailValidation) {
    return res.status(400).json({ message: `User already exists with this email Id: ${email}.` })
  }
  if (!validRoles.includes(role.toLowerCase())) {
    return res.status(400).json({ message: "Enter Valid Roles only i.e., Admin or User" })
  }
  else {
    const id = users.length + 1;
    const validRole = role.charAt(0).toUpperCase() + role.charAt(1);
    const newUser = { id, name, email, age, validRole, isActive };
    users.push(newUser);
    return res.status(201).json({
      message: "New user Created successfully",
      data: newUser
    });
  }
}

function updateUser(req, res) {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(403).json({ error: "User ID is required." });
  }
  let { name, email, age, role, isActive } = req?.body;

  if (!name && !email && !age && !role && isActive === undefined) {
    return res.status(403).json({ error: `Atleast 1 query param is required from these: "name", "email", "age", "role", "isActive". ` });
  }
  if(email){
    const emailValidation = users.find((user) => user.email === email)
    if (emailValidation) {
      return res.status(400).json({ message: `Can not update User, email already exists: ${email}.` })
    }
  }
  else {
    const foundUser = users.find((user) => user.id === id);

    const updates = req.body;

    if (foundUser) {
      if (name) foundUser.name = name;
      if (email) foundUser.email = email;
      if (age) foundUser.name = name;
      if (role) foundUser.email = email;
      if (isActive) foundUser.name = name;

      return res.status(201).json({
        message: "User Updated Successfully",
        data: foundUser
      });
    }
  }
}

function deleteUser(req, res) {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(403).json({ error: "Please enter user id to proceed." });
  }
  else {
    const index = users.findIndex((user) => user.id === id);
    //  console.log(index);
    users.splice(index, 1);
    return res.status(200).json({ message: "User Deleted Successfully" });
  }
}


function fileUpload(req,res){
  const id = parseInt(req.params.id);

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Validate user
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ error: `No user found with id: ${id}` });
  }

  // Save image URL to user's data
  const imageUrl = `/uploads/${req.file.filename}`;
  user.imageUrl = imageUrl;

  res.json({
    message: 'Image uploaded successfully',
    file: imageUrl,
    user
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