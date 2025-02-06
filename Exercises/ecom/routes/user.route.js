const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const { getUsers, getUserProfile, updateUserProfile } = require("../controllers/userController");
const validator = require("../validators/validator");
const { userUpdateSchema, userGetSchema } = require("../validationSchema/userSchema");


router.get("/", authorizeRole(['admin']), validator(userGetSchema),getUsers);
router.get("/profile", authorizeRole(['admin','customer']), getUserProfile);

router.put("/profile", authorizeRole(['admin','customer']), validator(userUpdateSchema), updateUserProfile);

module.exports = router;