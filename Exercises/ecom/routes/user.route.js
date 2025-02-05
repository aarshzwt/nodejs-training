const express = require("express");
const router = express.Router();


const { authorizeRole } = require("../middleware/authorizeRole");
const { getUsers, getUserProfile, updateUserProfile } = require("../controllers/userController");


router.get("/", authorizeRole(['admin']), getUsers);
router.get("/profile", authorizeRole(['admin','customer']), getUserProfile);

router.put("/profile", authorizeRole(['admin','customer']), updateUserProfile);

module.exports = router;