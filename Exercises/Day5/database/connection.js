require('dotenv').config();
const mysql = require('mysql2');


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
}).promise();

pool.getConnection()
    .then(connection => {
        console.log('Connected!');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting:', err);
    });

module.exports = pool;