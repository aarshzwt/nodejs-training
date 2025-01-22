const fs = require('fs');
const path = require('path');

const content = 'Aarsh Patel';

const filePath= path.join(__dirname, 'test.txt');

fs.writeFile(filePath, content, { flag: 'a+' }, err => {
  if (err) {
    console.error(err);
  } else {
    console.log("File written Successfully");
  }
});
