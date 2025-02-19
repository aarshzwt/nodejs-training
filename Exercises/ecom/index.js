const express = require('express');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const categoryRoutes = require('./routes/category.route')
const productRoutes = require('./routes/product.route')
const cartRoutes = require('./routes/cart.route')
const wishlistRoutes = require('./routes/wishlist.route')
const orderRoutes = require('./routes/order.route')

const logReq = require('./middleware/logReq');

const app = express()
const port = 5000
const cors = require("cors");


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }));
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

app.use(logReq);


//Inside app.js
// app.post('/createOrder', (req, res)=>{ 

//     const {amount,currency,receipt, notes}  = req.body;      
        
//     razorpayInstance.orders.create({amount, currency, receipt, notes}, 
//         (err, order)=>{
        
//           if(!err)
//             res.json(order)
//           else
//             res.send(err);
//         }
//     )
// });


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/orders", orderRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

sequelize.sync()
    .then(() => {
        console.log('Database connected and tables synced');
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });
