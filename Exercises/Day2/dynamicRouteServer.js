const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');



const server = http.createServer((req, res) => {
    // const url = req.url;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const location = path.join(__dirname, "files");

    if (url.pathname === '/') {
        res.setHeader('Content-Type', 'text/plain');
        res.end('Welcome to the Node.js Tutorial');
    }

    else if (url.pathname === '/list') {
        const location = path.join(__dirname, "files");

        if (!fs.existsSync(location)) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('no folder called files exists.');
        }
        else {
            fs.readdir(location, (err, files) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    return res.end('ERROR!!!');
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
    
                    if (files.length === 0) {
                        return res.end(JSON.stringify({ message: "No files found" }));
                    }
    
                    return res.end(JSON.stringify(files));
                }
            });
        }

    }

    else if (url.pathname === '/file') {
        const fileName = url.searchParams.get('name');
        console.log(fileName);

        if (!fs.existsSync(location)) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('no folder called files exists.');
        }
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

    else if (url.pathname === '/create') {
        const fileName = url.searchParams.get('name');
        const fileContent = url.searchParams.get('content');

        if (!fs.existsSync(location)) {
            fs.mkdirSync(location);
            console.log("Folder 'files' created.");
        } else {
            console.log("Folder 'files' already exists.");
        }
        if (!fileName || !fileContent) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('ERROR: filename & content query parameters both are required');
        }

        if (!fileName.endsWith(".txt")) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('ERROR: write appropriate extension i.e. .txt');
        }

        const invalidChars = /[<>:"/\\|?*]/;
        if (invalidChars.test(fileName)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid characters in filename' }));
        }

        if (fs.existsSync(fileName)) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end(`ERROR: file with file name ${fileName} already exists. `);
        } 
        else {
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
    }

    else if (url.pathname === '/append') {
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
                res.end(`New Content ${fileContent} Appended Successfully into ${fileName}`);
            }
        });
    }

    else if (url.pathname === '/delete') {
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
        res.end('INVALID PATH');

    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});