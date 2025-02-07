const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const validator = require("../validators/validator");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const { imageUpload, handleMulterError } = require("../middleware/fileUpload");
const { productCreateSchema, productUpdateSchema, productGetSchema } = require("../validationSchema/productSchema");



router.get("/", validator(productGetSchema), getProducts);
router.get("/:id", getProductById);

router.post("/", authorizeRole(['admin']), imageUpload, handleMulterError, validator(productCreateSchema), createProduct);

router.patch("/:id", authorizeRole(['admin']), imageUpload, handleMulterError, validator(productUpdateSchema), updateProduct);

router.delete("/:id", authorizeRole(['admin']), deleteProduct)


module.exports = router;
