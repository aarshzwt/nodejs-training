const users = require("../constant")

function welcome(req, res) {
  res.status(200).json({ message: "Welcome to the User Management API!" });
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
    res.status(200).json({ users: filteredUsers });
  }
  else{
    res.status(404).json({message: "No users found."})
  }
}

function getUserById(req,res){
    const id = parseInt(req.params.id);

    const foundUser = users.find((user) => user.id === id);
    if (foundUser) {
        res.status(200).json(foundUser);
    }
    else {
        res.status(404).json({message: `No user found with id: ${id}.`})
    }
}

function createUser(req,res){
    let { name, email, age, role, isActive } = req.body;
    age = parseInt(age);
    isActive = Boolean(isActive);
    // console.log(name, email, age, role, isActive);

    if (!name || !email || !age || !role || isActive === undefined) {
        res.status(403).json({error:"Each query params are required"});
    }
    const emailValidation = users.find((user) => user.email === email)
    if(emailValidation){
      res.status(400).json({message: `User already exists with this email Id: ${email}.`})
    }
    else { 
        const id = users.length + 1;
        const newUser = {id, name, email, age, role, isActive };
        users.push(newUser);
        res.status(201).json({message:`New user Created with id: ${id}, name: ${name}, email: ${email}, age: ${age}, role: ${role}`});
    }
}

function updateUser(req,res){
    const id = parseInt(req.params.id);
    if(!id){
        res.status(403).json({error:"Please enter user id to proceed."});
    }
    let { name, email, age, role, isActive } = req?.body;

    if (!name && !email && !age && !role && !isActive) {
        res.status(403).json({error:"Atleast 1 query param is required"});
    }
    else {
        const foundUser = users.find((user) => user.id === id);

        if (foundUser) {
            if (name) foundUser.name = name;
            if (email) foundUser.email = email;
            if (age) foundUser.name = name;
            if (role) foundUser.email = email;
            if (isActive) foundUser.name = name;

            res.status(201).json({message:`User Updated ${JSON.stringify(foundUser)}`});
        }
    }
}

function deleteUser(req,res){
    const id = parseInt(req.params.id);
    if(!id){
        res.status(403).json({error:"Please enter user id to proceed."});
    }
    else{
         const index= users.findIndex((user) => user.id === id);
        //  console.log(index);
         users.splice(index,1);
         res.status(200).json({message:"User Deleted Successfully"});
    }
}

module.exports = {
    welcome,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };