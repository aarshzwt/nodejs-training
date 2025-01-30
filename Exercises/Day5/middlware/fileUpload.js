const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Create upload directories
const createUploadDir = (dir) => {
    const uploadDir = path.join(__dirname, "..", "..", "..", "uploads", dir);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
};

// Image Storage and Filter
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
        // This will trigger MulterError
        return cb(new Error("Only Images are allowed (jpeg, jpg, png)"), false);
    }
}

// Image upload handler
const imageUpload = multer({
    storage: imageStorage,
    limits: { fileSize: 2000000 },
    fileFilter: imageFilter
}).single("image");

// PDF Storage and Filter
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
        // This will trigger MulterError
        return cb(new Error("Only pdf is allowed (.pdf)"), false);
    }
}

// PDF upload handler
const pdfUpload = multer({
    storage: pdfStorage,
    limits: { fileSize: 2000000 },
    fileFilter: pdfFilter
}).single("pdf");

// Error handling middleware to capture Multer errors
function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the 2MB limit.' });
    } else {
      return res.status(400).json({ error: err.message || 'File upload error' });
    }
  } else if (err) {
    return res.status(500).json({ error: err.message || 'Something went wrong!' });
  }
  next();
}

module.exports = { imageUpload, pdfUpload, handleMulterError };
