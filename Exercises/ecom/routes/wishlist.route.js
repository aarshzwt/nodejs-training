const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const { getWishlistItems, addItemToWishlist, deleteWishlistItem } = require("../controllers/wishlistController");



router.get("/",  authorizeRole(['customer']), getWishlistItems);
router.post("/", authorizeRole(['customer']), addItemToWishlist);
router.delete("/:id", authorizeRole(['customer']), deleteWishlistItem);

module.exports = router;
