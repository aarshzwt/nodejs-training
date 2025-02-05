const db = require("../models")
const { Cart, Product, Category } = db

async function getCartItems(req, res) {
    try {
        const user_id = req.id;

        const cartItems = await Cart.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name', 'price', 'stock', 'category_id'],
                },
            ],
        });


        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: `No items found in cart for user with id: ${user_id}.` });
        }
        const formattedCartItems = cartItems.map(item => ({
            id: item.id,
            user_id: item.user_id,
            quantity: item.quantity,
            product: {
                id: item.Product.id,
                name: item.Product.name,
                price: item.Product.price,
                stock: item.Product.stock,
                category_id: item.Product.category_id
            }
        }));
        return res.status(200).json({
            cartItems: formattedCartItems,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching cart items", error: error })
    }

}

async function addItemToCart(req, res) {
    try {
        const user_id = req.id;
        const { product_id, quantity } = req.body;

        const existingProduct = await Product.findOne({ where: { id: product_id } })
        if (!existingProduct) {
            return res.status(404).json({ message: `no product exists with id ${product_id}` })
        }
        if(existingProduct.stock < quantity){
            return res.status(400).json({ message: `not enough product stock available`, availableStock:  existingProduct.stock})
        }
        const cartItem = await Cart.create({ user_id, product_id, quantity })
        return res.status(200).json({ message: "Product has been added to the cart", cartItem: cartItem })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error adding item to the cart", error: error })
    }
}

async function deleteCartItem(req, res) {
    try {
        const id = req.params.id;
        const cartItem = await Cart.findOne({ where: { id } });
        if (!cartItem) {
            return res.status(404).json({ message: `No cart item found with id: ${id}.` })
        }
        await Cart.destroy({ where: { id } });
        return res.status(200).json({ message: "Cart Item deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error deleting cart item", error: error })
    }
}

module.exports = { getCartItems, addItemToCart, deleteCartItem }