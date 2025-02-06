const fs = require('fs');
const path = require('path');

//logger middleware function
const logReq = (req, res, next) => {
    const filePath = path.join(__dirname, "..", "requestLogs.txt");

    const { method, url } = req;

    const timeStamp = new Date();

    const temp = `Method: ${method},  URL: ${url}, TimeStamp: ${timeStamp}, Message: ${JSON.stringify(req.body)} \n`;

    fs.appendFile(filePath, `\n ${temp}`, err => {
        if (err) {
            console.error(`Error appending the content to the file:${err}`);         
        }
        next();
    })

}

module.exports = logReq;