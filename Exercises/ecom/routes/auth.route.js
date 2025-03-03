const express = require("express");
const router = express.Router();

const { createUser, userLogin, refreshAccessToken } = require("../controllers/authController");
const validator = require("../validators/validator");
const { userCreateSchema, userLoginSchema } = require("../validationSchema/userSchema");


router.post("/register", validator(userCreateSchema), createUser);

router.post("/login", validator(userLoginSchema), userLogin);

router.post("/refresh-token", refreshAccessToken);

module.exports = router;
