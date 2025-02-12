const express = require("express");
const { getCategories, createCategory, getProductByCategory } = require("../controllers/categoryController");
const { authorizeRole } = require("../middleware/authorizeRole");
const { imageUpload, handleMulterError } = require("../middleware/fileUpload");
const router = express.Router();



router.get("/", getCategories);
router.get("/products/:category_id", getProductByCategory);


router.post("/", authorizeRole(['admin']), imageUpload.single("categoryImg"), handleMulterError, createCategory);


module.exports = router;