const db = require("../models")
const { Cart, Product, Category } = db


//GET all cart items controller function 
async function getCartItems(req, res) {
    try {
        const user_id = req.id;

        const cartItems = await Cart.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    attributes: ['id', 'name', 'price', 'stock', 'category_id', 'image_url', 'brand'],
                },
            ],
        });

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: `No items found in cart for user_id: ${user_id}.`, cartItems: cartItems });
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
                category_id: item.Product.category_id,
                image_url: item.Product.image_url,
                brand: item.Product.brand
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

//POST add item to cart controller function
async function addItemToCart(req, res) {
    try {
        const user_id = req.id;
        const { product_id, quantity } = req.body;

        const validProduct = await Product.findOne({ where: { id: product_id } })
        if (!validProduct) {
            return res.status(404).json({ message: `no product exists with id ${product_id}, please enter valid product.` })
        }
        //if product does not already exists in cart then compare the quantity with the stock and add it if condition satisfies 
        const existingProductInCart = await Cart.findAll({ where: { user_id: user_id, product_id: product_id } })
        if (existingProductInCart.length === 0) {
            if (validProduct.stock < quantity) {
                return res.status(400).json({
                    message: `Not enough product stock available.`,
                    availableStock: validProduct.stock
                });
            }
            const cartItem = await Cart.create({ user_id, product_id, quantity });
            return res.status(201).json({ message: "Product has been added to the cart", cartItem });
        }

        //otherwise update the quanity of that product in cart
        let totalQuantity = 0;
        existingProductInCart.forEach(cartItem => {
            totalQuantity += cartItem.quantity;
        });

        if (totalQuantity + quantity > validProduct.stock) {
            return res.status(400).json({
                message: `Not enough product stock available.`,
                availableStock: validProduct.stock
            });
        }
        for (let cartItem of existingProductInCart) {
            cartItem.quantity += quantity;
            await cartItem.save();
        }

        return res.status(201).json({ message: "Product quantity updated in the cart", cartItems: existingProductInCart });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error adding item to the cart", error: error })
    }
}

//POST add item to cart controller function
async function removeOneQuantityCart(req, res) {
    try {
        const user_id = req.id;
        const { product_id, quantity } = req.body;

        const validProduct = await Product.findOne({ where: { id: product_id } })
        if (!validProduct) {
            return res.status(404).json({ message: `no product exists with id ${product_id}, please enter valid product.` })
        }

        const cartItem = await Cart.findOne({ where: { user_id, product_id } });
        if (!cartItem) {
            return res.status(404).json({ message: `No cart item found for product_id ${product_id}.` });
        }
        let updatedQuantity = cartItem.quantity - quantity;

        if (updatedQuantity <= 0) {
            await Cart.destroy({ where: { id: cartItem.id } });
            return res.status(200).json({ message: "Cart item deleted successfully." });
        }
        await cartItem.update({ quantity: updatedQuantity });
        return res.status(200).json({ message: "Cart item quantity updated.", cartItem });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error deleting 1 quantiy from the cart", error: error })
    }
}

//DELETE cart item controller function 
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

module.exports = { getCartItems, addItemToCart, removeOneQuantityCart, deleteCartItem }