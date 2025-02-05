const express = require("express");
const router = express.Router();

const { createUser, userLogin } = require("../controllers/authController");
const validator = require("../validators/validator");
const { userCreateSchema, userLoginSchema } = require("../validationSchema/userSchema");


router.post("/register", validator(userCreateSchema), createUser);
router.post("/login", validator(userLoginSchema), userLogin);


module.exports = router;
