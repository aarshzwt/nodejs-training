const db = require("../models")
const { Wishlist, Product } = db

//GET wishlist controller function
async function getWishlistItems(req, res) {
    try {
        const user_id = req.id;
        
        //pagination details
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const totalProducts = await Wishlist.count();

        const wishlistItems = await Wishlist.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name', 'price', 'stock', 'category_id'],
                },
            ],
            limit: limit,
            offset: offset
        });


        if (!wishlistItems || wishlistItems.length === 0) {
            return res.status(404).json({ message: `No items found in wishlist for user id: ${user_id}.` });
        }
        const totalPages = Math.ceil(totalProducts / limit);

        const formattedWishlistItems = wishlistItems.map(item => ({
            id: item.id,
            user_id: item.user_id,
            product: {
                id: item.Product.id,
                name: item.Product.name,
                price: item.Product.price,
                stock: item.Product.stock,
                category_id: item.Product.category_id

            }
        }));
        return res.status(200).json({
            wishlistItems: formattedWishlistItems,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalProducts,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching Wishlist Items", error: error })
    }

}

//POST wishlist controller function
async function addItemToWishlist(req, res) {
    try {
        const user_id = req.id;
        const { product_id } = req.body;

        const existingProduct = await Product.findOne({ where: { id: product_id } })
        if (!existingProduct) {
            return res.status(404).json({ message: `no product exists with id ${product_id}` })
        }
        const existingProductInWishlist = await Wishlist.findOne({ where: { user_id: user_id, product_id: product_id } })
        if (existingProductInWishlist) {
            return res.status(400).json({ message: `product already exists in the wishlist` })
        }

        const wishlistItem = await Wishlist.create({ user_id, product_id })
        return res.status(200).json({ message: "Product has been added to the Wishlist", wishlistItem: wishlistItem })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error adding item to the wishlist", error: error })
    }
}

//DELETE wishlist controller function
async function deleteWishlistItem(req, res) {
    try {
        const product_id = req.params.id;
        const wishlistItem = await Wishlist.findOne({ where: { product_id } });
        if (!wishlistItem) {
            return res.status(404).json({ message: `No wishlist item found with product_id: ${product_id}.` })
        }
        await Wishlist.destroy({ where: { product_id } });
        return res.status(200).json({ message: "Wishlist Item deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error deleting Wishlist Item", error: error })
    }
}

module.exports = { getWishlistItems, addItemToWishlist, deleteWishlistItem }