const express = require("express");
const router = express.Router();

const { createUser, userLogin } = require("../controllers/authController");
const userValidator = require("../validators/userValidator");
const { userCreateSchema } = require("../validationSchema/userSchema");


router.post("/register", userValidator(userCreateSchema), createUser);
router.post("/login", userLogin);


module.exports = router;
