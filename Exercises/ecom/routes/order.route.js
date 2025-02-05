const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const { getAllOrders, getOrderById, placeOrder, updateOrder } = require("../controllers/orderController");



router.get("/",  authorizeRole(['customer']), getAllOrders);
router.get("/:id",  authorizeRole(['customer']), getOrderById);

router.post("/", authorizeRole(['customer']), placeOrder);

router.put("/:id", authorizeRole(['admin']), updateOrder);

module.exports = router;
