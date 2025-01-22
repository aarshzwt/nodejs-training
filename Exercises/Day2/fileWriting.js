const fs = require('fs');
const path = require('path');
const readline = require("readline");

let rl = readline.createInterface(process.stdin, process.stdout);

function validateFileName(fileName) {
    const regex = /\.[a-zA-Z0-9]+$/;
    if (regex.test(fileName)) {
        if (!fileName.endsWith(".txt")) {
            throw new Error("File Name supports only .txt format. Try again adding it or do not include extension at all.");
        }
        return fileName;
    }
    else {
        return fileName + ".txt";
    }
}

function promptFunction() {
    rl.question('Enter the file name: ', (fileName) => {
        try {
            const name = validateFileName(fileName); //Validate the Filename and throws error if and when needed.

            rl.question('Enter file content you want to write: ', (fileContent) => {
                const content = fileContent;
                const dirPath = path.join(__dirname, "files");
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                    console.log("Folder 'files' created.");
                } else {
                    console.log("Folder 'files' already exists.");
                }
                const filePath = path.join(dirPath, name);

                fs.writeFile(filePath, content, { flag: 'a+' }, (err) => {
                    if (err) {
                        console.error('Error writing to file:', err);
                    } else {
                        console.log("File written successfully");
                    }
                    rl.close();
                });
            });
        }
        catch (error) {
            console.error(error.message);
            rl.close();
        }
    });
}

promptFunction();
