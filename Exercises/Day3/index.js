const express = require('express')
const app = express()
const port = 5000
const logReq = require("./Middlware/logReq")

const userRoutes = require("./routes/users");

app.use(express.json());
app.use(logReq);
app.use("/", userRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})