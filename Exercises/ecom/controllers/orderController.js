const db = require("../models")
const { Order, OrderItem, Product, Cart } = db

//GET all orders controller function
async function getAllOrders(req, res) {
    try {
        const user_id = req.id;

        const orders = await Order.findAll({
            where: { user_id }
        });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: `No orders found for user: ${user_id}.` });
        }
        return res.status(200).json({
            orders: orders,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching orders", error: error })
    }

}

//GET order details controller function
async function getOrderById(req, res) {
    try {
        const id = req.params.id;

        const order = await Order.findOne({ 
            where: { id },
            include: [
                {
                    model: OrderItem, // Include the order items
                    include: [
                        {
                            model: Product, // Include the related product for each order item
                            attributes: ['id', 'name', 'price', 'image_url'], // Fetch the image_url, price, name, etc.
                        },
                    ],
                },
            ],
        });
        if (!order) {
            return res.status(404).json({ message: `No order found with id: ${id}.` })
        }

        return res.status(200).json({ order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching order", error: error })
    }
}

//Utility function for calculating Total Cart Price
async function calculateCartTotalPrice(userCartItems) {
    let total_price = 0;
    const cartItemsDetails = [];

    for (let cartItem of userCartItems) {
        let quantity = cartItem.quantity;
        let product_id = cartItem.product_id;
        const productDetails = await Product.findOne({ where: { id: product_id } });
        const totalPriceForProduct = quantity * productDetails.price;
        total_price += totalPriceForProduct;
        const updatedStock = productDetails.stock - quantity;
        cartItemsDetails.push({ product_id, quantity, totalPriceForProduct, updatedStock });
    }

    return { total_price, cartItemsDetails };
}

//POST order controller function
async function placeOrder(req, res) {
    try {
        const user_id = req.id;

        const userCartItems = await Cart.findAll({ where: { user_id }})
        if( userCartItems.length === 0 ){
            return res.status(404).json({ message: `there are no items in cart to proceed with order placement.` })
        }
       
        const { total_price, cartItemsDetails } = await calculateCartTotalPrice(userCartItems);

        const order = await Order.create({ user_id, total_price });
        const order_id = order.id;

        const orderItems = cartItemsDetails.map(cartItem => ({
            order_id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            price: cartItem.totalPriceForProduct,
        }));

        const updatedStocks = cartItemsDetails.map(cartItem => ({
            id: cartItem.product_id,
            stock: cartItem.updatedStock
        }));

        await OrderItem.bulkCreate(orderItems);

        // Perform bulk update for product stocks
        for (let stock of updatedStocks) {
            await Product.update({ stock: stock.stock }, { where: { id: stock.id } });
        }
        await Cart.destroy({ where: {user_id} })

        return res.status(200).json({ message: `order placed successfully`, order:order, orderItems :orderItems });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error placing the order", error: error })
    }
}

//PUT order controller function for changing status
async function updateOrder(req, res) {
    try {
        const id = req.params.id;
        const order = await Order.findOne({ where: { id } });
        if (!order) {
            return res.status(404).json({ message: `No order found with id: ${id}.` })
        }
        const status = req.body.status;
        const [affectedRows] = await Order.update({ status }, { where: { id } });

        console.log(affectedRows);
        if (affectedRows > 0) {
            const updatedOrder = await Order.findOne({ where: { id } });
            return res.status(201).json({
                message: "Order Updated Successfully",
                updatedOrder: updatedOrder,
            });
        } else {
            return res.status(500).json({ message: "Error updating the Order." });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error updating the order", error: error })
    }
}


module.exports = { getAllOrders, getOrderById, placeOrder, updateOrder }