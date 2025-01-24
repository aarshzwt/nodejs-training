const express = require("express")
const router = express.Router()
const validateId = require("../Middlware/validateId")
const mainController = require("../Controllers/mainController")

router.get('/', mainController.welcome)

router.get('/users', mainController.getUsers)

router.get('/users/:id', validateId, mainController.getUserById)

router.post('/users', mainController.createUser)

router.patch('/users/:id', validateId, mainController.updateUser)

router.delete('/users/:id', validateId, mainController.deleteUser)

router.post('/upload-image',mainController.upload.single('file'),  mainController.fileUpload)


module.exports = router;
