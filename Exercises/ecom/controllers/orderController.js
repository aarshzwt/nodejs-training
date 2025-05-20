const { date } = require("yup");
const db = require("../models");
const { Order, OrderItem, Product, Cart, TemporaryOrder, Payment, sequelize } = db;

const { razorpayInstance } = require("../utils/razorpayInstance");
const crypto = require('crypto');
const { transporter, mailOptions } = require("../utils/mailSender");
const mailTemplate = require("../utils/mailTemplate");

//GET all orders of perticular user controller function
async function getAllOrders(req, res) {
    try {
        const user_id = req.id;

        const orders = await Order.findAll({
            where: { user_id },
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product, // Include the related product for each order item
                            attributes: ['id', 'name', 'price', 'image_url'],
                        },
                    ],
                },
            ],
        });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: `No orders found for user: ${user_id}.`, orders: orders });
        }
        return res.status(200).json({
            orders: orders,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching orders", error: error })
    }

}

//GET all orders controller function
async function getAllUserOrders(req, res) {
    try {

        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product, // Include the related product for each order item
                            attributes: ['id', 'name', 'price', 'image_url'],
                        },
                    ],
                },
            ],
        });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: `No orders found` });
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
                    model: OrderItem,
                    include: [
                        {
                            model: Product, // Include the related product for each order item
                            attributes: ['id', 'name', 'price', 'image_url'],
                        },
                    ],
                },
            ],
        });
        console.log(order);
        if (!order) {
            return res.status(404).json({ message: `No order found with id: ${id}.`, order: order })
        }

        return res.status(200).json({ order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching order", error: error })
    }
}

//GET total_price per user controller function
async function getTotalPricePerUser(req, res) {
    try {

        const order = await Order.findAll({
            attributes: ['user_id', [db.Sequelize.fn('SUM', db.Sequelize.col('total_price')), 'total_price']],
            group: ['user_id'],
            having: db.Sequelize.literal('SUM(total_price) > 1000')
        });
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
    const transaction = await sequelize.transaction();
    try {
        const user_id = req.id;
        const userCartItems = await Cart.findAll({ where: { user_id }, transaction });
        if (userCartItems.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: `there are no items in cart to proceed with order placement.` });
        }

        const { total_price, cartItemsDetails } = await calculateCartTotalPrice(userCartItems);

        const updatedStocks = [];
        for (let cartItem of cartItemsDetails) {
            const product = await Product.findOne({
                where: { id: cartItem.product_id },
                transaction,
            });

            if (product.stock < cartItem.quantity) {
                await transaction.rollback();
                return res.status(400).json({ message: `Not enough stock for product ${cartItem.product_id}.` });
            }

            updatedStocks.push({
                id: product.id,
                stock: product.stock - cartItem.quantity,
            });
        }


        const amount = parseInt(total_price) * 100;
        const currency = "INR";
        const receipt = `receipt ${Date.now()}`;

        const razorpayOrder = await razorpayInstance.orders.create({ amount, currency, receipt, payment_capture: 1 });
        console.log("razorpayOrder", razorpayOrder);


        // Store razorpay_order_id in the TemporaryOrder table
        await TemporaryOrder.create({ user_id, razorpay_order_id: razorpayOrder.id, total_price }, { transaction });
        await transaction.commit();
        return res.status(200).json({ message: `temporary order placed successfully`, razorpayOrder: razorpayOrder, cartItemsDetails: cartItemsDetails });
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return res.status(500).json({ message: "Error placing the order", error: error });
    }
}

//POST order controller function
async function confirmOrder(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const user_id = req.id;
        console.log("user_id in confirmOrder", user_id);

        const userCartItems = await Cart.findAll({ where: { user_id } });
        if (userCartItems.length === 0) {
            return res.status(404).json({ message: `there are no items in cart to proceed with order placement.` });
        }

        const { total_price, cartItemsDetails } = await calculateCartTotalPrice(userCartItems);

        const updatedStocks = [];
        for (let cartItem of cartItemsDetails) {
            const product = await Product.findOne({
                where: { id: cartItem.product_id },
                lock: true,
                transaction,
            });

            if (product.stock < cartItem.quantity) {
                await transaction.rollback();
                return res.status(400).json({ message: `Not enough stock for product ${cartItem.product_id}.` });
            }

            updatedStocks.push({
                id: product.id,
                stock: product.stock - cartItem.quantity,
            });
        }
        // Retrieve razorpay_order_id from the TemporaryOrder table
        const tempOrder = await TemporaryOrder.findOne({ where: { user_id } });
        if (!tempOrder) {
            return res.status(404).json({ message: `No temporary order found for user: ${user_id}.` });
        }
        console.log("tempOrder in confirmOrder", tempOrder);
        // const payment = await Payment.create({ razorpay_payment_id, razorpay_order_id });


        // const order = await Order.create({ user_id, total_price, razorpay_order_id }, { transaction });
        // const order_id = order.id;

        // const orderItems = cartItemsDetails.map(cartItem => ({
        //     order_id,
        //     product_id: cartItem.product_id,
        //     quantity: cartItem.quantity,
        //     price: cartItem.totalPriceForProduct,
        // }));
        // await OrderItem.bulkCreate(orderItems, { transaction });

        // Perform bulk update for product stocks
        // for (let stock of updatedStocks) {
        //     await Product.update(
        //         { stock: stock.stock },
        //         { where: { id: stock.id }, lock: true, 
        //         transaction }
        //     );
        // }

        // await Cart.destroy({ where: { user_id }, transaction });

        // Remove the temporary order record
        // await TemporaryOrder.destroy({ where: { user_id }, transaction });

        await transaction.commit();
        return res.status(200).json({ message: `Order placed successfully`, order: tempOrder });
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return res.status(500).json({ message: "Error placing the order", error: error });
    }
}

async function payment(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const user_id = req.id;
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        // Verify the signature
        const hmac = crypto.createHmac('sha256', process.env.RZP_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        const tempOrder = await TemporaryOrder.findOne({ where: { user_id } });
        if (!tempOrder) {
            return res.status(404).json({ message: `No temporary order found for user: ${user_id}.` });
        }

        const order = await Order.create({ user_id, total_price: tempOrder.total_price, razorpay_order_id }, { transaction });
        console.log("order in payment", order);
        const order_id = order.id;

        const userCartItems = await Cart.findAll({ where: { user_id } });
        if (userCartItems.length === 0) {
            return res.status(404).json({ message: `there are no items in cart to proceed with order placement.` });
        }

        const { total_price, cartItemsDetails } = await calculateCartTotalPrice(userCartItems);

        const orderItems = cartItemsDetails.map(cartItem => ({
            order_id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            price: cartItem.totalPriceForProduct,
        }));
        await OrderItem.bulkCreate(orderItems, { transaction });

        const updatedStocks = [];
        for (let cartItem of cartItemsDetails) {
            const product = await Product.findOne({
                where: { id: cartItem.product_id },
                transaction,
            });

            if (product.stock < cartItem.quantity) {
                await transaction.rollback();
                return res.status(400).json({ message: `Not enough stock for product ${cartItem.product_id}.` });
            }

            updatedStocks.push({
                id: product.id,
                stock: product.stock - cartItem.quantity,
            });
        }

        // Perform bulk update for product stocks
        for (let stock of updatedStocks) {
            await Product.update(
                { stock: stock.stock },
                {
                    where: { id: stock.id },
                    lock: true,
                    transaction
                }
            );
        }

        await Cart.destroy({ where: { user_id }, transaction });
        // Remove the temporary order record
        await TemporaryOrder.destroy({ where: { user_id }, transaction });

        const payment = await Payment.create({ razorpay_payment_id, razorpay_order_id }, { transaction });
        await transaction.commit();

        return res.status(200).json({ message: `Payment Successful`, payment: payment, order: order });
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return res.status(500).json({ message: "Error placing the payment details", error: error });
    }
}

async function sendMail(req, res) {
    try {
        const { orderDetails, email } = req.body;
        console.log("sendMail orderDetails", orderDetails);
        const customMailOptions = {
            ...mailOptions,
            to: email,
            html: `${mailTemplate({ orderDetails })}`
        };

        transporter.sendMail(customMailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.status(200).json({ message: `email sent Successfully` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email", error: error });
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


module.exports = { getAllOrders, getAllUserOrders, getTotalPricePerUser, getOrderById, placeOrder, updateOrder, confirmOrder, payment, sendMail }