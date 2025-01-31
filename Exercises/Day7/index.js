const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const userRoutes = require('./routes/users');
const logReq = require('./middleware/logReq');
const { FORCE } = require('sequelize/lib/index-hints');

const app = express()
const port = 5000

app.use(express.json());

// app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

app.use(logReq);

app.use("/", userRoutes);

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
