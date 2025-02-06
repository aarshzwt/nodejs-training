const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const validator = require("../validators/validator");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const { imageUpload, handleMulterError } = require("../middleware/fileUpload");
const { productCreateSchema, productUpdateSchema } = require("../validationSchema/productSchema");



router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", imageUpload, handleMulterError, validator(productCreateSchema), authorizeRole(['admin']),  createProduct);

router.patch("/:id", imageUpload, handleMulterError, validator(productUpdateSchema), authorizeRole(['admin']), updateProduct);

router.delete("/:id", authorizeRole(['admin']), deleteProduct)


module.exports = router;
