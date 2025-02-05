const db = require("../models")
const { Order, OrderItem, Product } = db

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

async function getOrderById(req, res) {
    try {
        const id = req.params.id;

        const order = await Order.findOne({ where: { id } });
        if (!order) {
            return res.status(404).json({ message: `No order found with id: ${id}.` })
        }
        return res.status(200).json({ order: order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching order", error: error })
    }
}

async function placeOrder(req, res) {
    try {
        const user_id = req.id;
        const { total_price, status } = req.body;

        const order = await Order.create({ user_id, total_price, status })
        return res.status(200).json({ message: "Order placed Successfully", orderDetail: order })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error placing the order", error: error })
    }
}

async function updateOrder(req, res) {
    try {
        const id = req.params.id;
        const order = await Order.findOne({ where: { id } });
        if (!order) {
            return res.status(404).json({ message: `No order found with id: ${id}.` })
        }

        const status = req.body.status;
        const [affectedRows] = await Order.update(status,
            {
                where: { id },
            });
        console.log(affectedRows);
        if (affectedRows > 0) {
            const updatedOrder = await Order.findOne({ where: { id } });
            return res.status(200).json({
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