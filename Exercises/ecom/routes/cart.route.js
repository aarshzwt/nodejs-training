const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const { addItemToCart, getCartItems, deleteCartItem, removeOneQuantityCart } = require("../controllers/cartController");
const validator = require("../validators/validator");
const { cartCreateSchema } = require("../validationSchema/cartSchema");



router.get("/",  authorizeRole(['customer']), getCartItems);

router.post("/", authorizeRole(['customer']), validator(cartCreateSchema), addItemToCart);
router.post("/decrease", authorizeRole(['customer']), removeOneQuantityCart);


router.delete("/:id", authorizeRole(['customer']), deleteCartItem);

module.exports = router;
