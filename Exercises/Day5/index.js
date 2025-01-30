const express = require('express')
const path = require('path');

const app = express()
const port = 5000

const logReq = require("./middlware/logReq")
const userRoutes = require("./routes/users");

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));
app.use(logReq);

app.use("/", userRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})