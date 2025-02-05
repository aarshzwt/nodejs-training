const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const { createProduct } = require("../controllers/productController");
const { imageUpload } = require("../middleware/fileUpload");



// router.get("/", getProducts);
// router.get("/:id", getProduct);

router.post("/", imageUpload, authorizeRole(['admin']), createProduct);


module.exports = router;