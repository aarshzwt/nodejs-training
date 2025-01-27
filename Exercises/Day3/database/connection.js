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


// async function getUsers(req,res) {
    // try {
    //     const result = await pool.query('SELECT * from users');
    //     users=result[0];
    //     if(users){
    //         console.log(users);
    //         return res.status(200).json({ users: users });
    //     }
    //     else{
    //         return res.status(404)
    //     }
    // } catch (error) {
    //     console.error(error);
    // }
// }


// async function getUserById(id) {
    // try {
    //     const result= await pool.query (`SELECT * from users where id=?`,[id])
    //     console.log(result);

    // } catch(error){
    //     console.error(error);
    // }
// }
// getUsers();




// var mysql = require('mysql2');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "test"
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "INSERT INTO users (id, name, phone, class) VALUES (1, 'aarsh','9865765678', 'first')";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
// });