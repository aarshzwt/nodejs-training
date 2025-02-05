const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const { imageUpload, handleMulterError } = require("../middleware/fileUpload");



router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", imageUpload, authorizeRole(['admin']), handleMulterError, createProduct);
router.patch("/:id", imageUpload, authorizeRole(['admin']), handleMulterError, updateProduct);

router.delete("/:id", authorizeRole(['admin']), deleteProduct)


module.exports = router;
