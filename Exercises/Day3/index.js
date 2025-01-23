const express = require('express')
const app = express()
const port = 5000
const logReq = require("./Middlware/logReq")
const validateId = require("./Middlware/validateId")
const mainController = require("./Controllers/mainController")

app.use(express.json());
app.use(logReq);

app.get('/', mainController.welcome)

app.get('/users', mainController.getUsers)

app.get('/users/:id', validateId, mainController.getUserById)

app.post('/users', mainController.createUser)

app.patch('/users/:id', validateId, mainController.updateUser)

app.delete('/users/:id', validateId, mainController.deleteUser)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})