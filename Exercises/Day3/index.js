const express = require('express')
const app = express()
const port = 5000
const users = require("./constant")
const logReq = require("./Middlware/logReq")
const validateId = require("./Middlware/validateId")

app.use(express.json());
app.use(logReq);

app.get('/', (req, res) => {
    res.send('Welcome to the User Management API!')
})

app.get('/users', (req, res) => {

    let {age, role, isActive } = req.body;

    const filteredUsers = users;
    if(role){
        filteredUsers= users.filter((user)=>user.role === role);
    }
    if(isActive){
        filteredUsers= users.filter((user)=>user.isActive === isActive);
    }
    if(age){
        filteredUsers= users.filter((user)=>user.age >= isActive);
    }
    res.send(filteredUsers);
})

app.get('/users/:id', validateId, (req, res) => {
    const id = parseInt(req.params.id);

    const foundUser = users.find((user) => user.id === id);
    if (foundUser) {
        res.send(foundUser);
    }
    else {
        res.send(`Could not find any user with id: ${id}`);
    }
})

app.post('/users', (req, res) => {
    let { name, email, age, role, isActive } = req.body;
    console.log(name, email, age, role, isActive);

    if (!name || !email || !age || !role || !isActive) {
        res.send(" query params are required")
    }
    else {
        const existingUser = users.find((user) => user.id === id);
        if (existingUser) {
            res.send("User Already Exists");
        }
        const newUser = { name, email, age, role, isActive };
        users.push(newUser);
        res.send(`New user Created: name: ${name}, email: ${email}, age: ${age}, role: ${role} `);
    }
})

app.patch('/users/:id', validateId, (req, res) => {
    const id = parseInt(req.params.id);
    if(!id){
        res.send("Please enter user id to proceed.");
    }
    let { name, email, age, role, isActive } = req?.body;

    if (!name && !email && !age && !role && !isActive) {
        res.send("Atleast 1 query param is required");
    }
    else {
        const foundUser = users.find((user) => user.id === id);

        if (foundUser) {
            if (name) foundUser.name = name;
            if (email) foundUser.email = email;
            if (age) foundUser.name = name;
            if (role) foundUser.email = email;
            if (isActive) foundUser.name = name;

            res.send(`User Updated ${JSON.stringify(foundUser)}`);
        }
    }
})

app.delete('/users/:id', validateId, (req, res) => {
    const id = parseInt(req.params.id);
    if(!id){
        res.send("Please enter user id to proceed.");
    }
    else{
         const index= users.findIndex((user) => user.id === id);
         console.log(index);
         users.splice(index,1);
         res.send("User Deleted Successfully");
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})