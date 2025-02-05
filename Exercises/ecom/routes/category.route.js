const express = require("express");
const { getCategories, createCategory } = require("../controllers/categoryController");
const { authorizeRole } = require("../middleware/authorizeRole");
const router = express.Router();



router.get("/", getCategories);
router.post("/", authorizeRole(['admin']), createCategory);


module.exports = router;