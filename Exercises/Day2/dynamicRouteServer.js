const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');

const server = http.createServer((req, res) => {
    // const url = req.url;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const location = path.join(__dirname, "files");


    if (url.pathname === '/list') {
        const location = path.join(__dirname, "files");

        if (!fs.existsSync(location)) {
            fs.mkdirSync(location);
            console.log("Folder 'files' created.");
        } else {
            console.log("Folder 'files' already exists.");
        }

        fs.readdir(location, (err, files) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                return res.end('ERROR!!!');
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(files));
            }
        });
    }

    else if (url.pathname === '/file' && req.method === 'GET') {
        const fileName = url.searchParams.get('name');
        console.log(fileName);

        if (!fileName) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('ERROR: filename query parameter is required');
        }
        const filePath = path.join(location, fileName);

        fs.stat(filePath, (err, stats) => {

            if (err || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('ERROR: File not found');
            }
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('Error reading the file');
                }
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            });

        });

    }

    else if (url.pathname === '/create' && req.method === 'GET') {
        const fileName = url.searchParams.get('name');
        const fileContent = url.searchParams.get('content');

        if (!fileName || !fileContent) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('ERROR: filename & content query parameters both are required');
        }

        if (!fileName.endsWith(".txt")) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('ERROR: write appropriate extension i.e. .txt');
        }
        const filePath = path.join(location, fileName);

        fs.writeFile(filePath, fileContent, err => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error creating the file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`File ${fileName} created successfully with content: "${fileContent}"`);
            }
        });
    }

    else if (url.pathname === '/append' && req.method === 'GET') {
        const fileName = url.searchParams.get('name');
        const fileContent = url.searchParams.get('content');

        if (!fileName || !fileContent) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('ERROR: filename & content query parameters both are required');
        }
        if (!fileName.endsWith(".txt")) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('ERROR: write appropriate extension i.e. .txt');
        }
        const filePath = path.join(location, fileName);

        fs.appendFile(filePath, fileContent, err => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error appending the content in the file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('');
            }
        });
    }

    else if (url.pathname === '/delete' && req.method === 'GET') {
        const fileName = url.searchParams.get('name');

        if (!fileName) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('ERROR: filename query parameters is required');
        }
        if (!fileName.endsWith(".txt")) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('ERROR: write appropriate extension i.e. .txt');
        }
        const filePath = path.join(location, fileName);

        fs.unlink(filePath, err => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error deleting the file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Successfully Deleted the file');
            }
        });
    }

    else {
        res.setHeader('Content-Type', 'text/plain');
        res.end('Welcome to the Node.js Tutorial');

    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});