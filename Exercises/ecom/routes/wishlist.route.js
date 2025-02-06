const express = require("express");
const router = express.Router();

const { authorizeRole } = require("../middleware/authorizeRole");
const { getWishlistItems, addItemToWishlist, deleteWishlistItem } = require("../controllers/wishlistController");
const validator = require("../validators/validator");
const { wishlistCreateSchema } = require("../validationSchema/wishlistSchema");



router.get("/",  authorizeRole(['customer']), getWishlistItems);
router.post("/", authorizeRole(['customer']), validator(wishlistCreateSchema), addItemToWishlist);
router.delete("/:id", authorizeRole(['customer']), deleteWishlistItem);

module.exports = router;
