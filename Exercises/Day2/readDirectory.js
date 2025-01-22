const fs = require('fs');
const path = require('path');

location = path.join(__dirname, "..", "Day1");
console.log(location);
fs.readdir(location, (err, files) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("\nDay1 directory filenames:");
        files.forEach(file => {
            console.log(file);
        });
    }
});


