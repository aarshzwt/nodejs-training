const multer = require('multer');
const fs = require('fs');
const path = require('path');


const createUploadDir = (dir) => {
    const uploadDir = path.join(__dirname, "..", "..", "..", "uploads", dir);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
};


const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const imageDir = createUploadDir("image");
        cb(null, imageDir); // Store in "uploads/image"
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
});
function imageFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb(new Error("Only Images are allowed (jpeg, jpg, png)"), false);
    }
}
const imageUpload = multer({
    storage: imageStorage,
    limits: { fileSize: 2000000 },
    fileFilter: imageFilter
}).single("image");


const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const pdfDir = createUploadDir("pdf");
        cb(null, pdfDir); // Store in "uploads/pdf"
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
});
function pdfFilter(req, file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb(new Error("Only pdf is allowed (.pdf)"), false);
    }
}
const pdfUpload = multer({
    storage: pdfStorage,
    limits: { fileSize: 2000000 },
    fileFilter: pdfFilter
}).single("pdf")

module.exports = { imageUpload, pdfUpload };
