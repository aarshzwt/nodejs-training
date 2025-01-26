const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname,"..","..","..", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if(mimetype && extname){
      return cb(null, true);
    } else {
        return cb(new Error("Only Images are allowed (jpeg, jpg, png)"), false);
    }
  }
  const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: function(_req, file, cb){
      checkFileType(file, cb);
  }
  });
  
  module.exports = { upload };
