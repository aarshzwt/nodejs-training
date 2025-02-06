const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const { getAllOrders, getOrderById, placeOrder, updateOrder } = require("../controllers/orderController");
const validator = require("../validators/validator");
const { orderUpdateSchema } = require("../validationSchema/orderSchema");



router.get("/",  authorizeRole(['customer']), getAllOrders);
router.get("/:id",  authorizeRole(['customer']), getOrderById);

router.post("/", authorizeRole(['customer']), placeOrder);

router.put("/:id", authorizeRole(['admin']),validator(orderUpdateSchema),updateOrder);

module.exports = router;
