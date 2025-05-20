const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const { getAllOrders, getAllUserOrders, getOrderById, placeOrder, updateOrder, confirmOrder, payment, sendMail, getTotalPricePerUser } = require("../controllers/orderController");
const validator = require("../validators/validator");
const { orderUpdateSchema } = require("../validationSchema/orderSchema");



router.get("/",  authorizeRole(['customer']), getAllOrders);
router.get("/all",  authorizeRole(['admin']), getAllUserOrders);
router.get("/:id",  authorizeRole(['customer']), getOrderById);
router.get("/users/totalPrice", getTotalPricePerUser);
// router.get("/:razorpayOrderId",  authorizeRole(['customer']), getOrderByRazorpayOrderId);

router.post("/", authorizeRole(['customer']), placeOrder);
router.post("/confirmOrder", authorizeRole(['customer']), confirmOrder);
router.post("/payment", authorizeRole(['customer']), payment);
router.post("/sendMail", authorizeRole(['customer']), sendMail);

router.put("/:id", authorizeRole(['admin']),validator(orderUpdateSchema),updateOrder);

module.exports = router;
