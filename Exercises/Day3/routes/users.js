const express = require("express");
const multer = require("multer");
const router = express.Router();
const validateId = require("../Middlware/validateId");

const {
  welcome,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  fileUpload,
} = require("../Controllers/userController");
const { upload } = require("../Middlware/fileUpload");

router.get("/", welcome);

router.get("/users", getUsers);

router.get("/users/:id", validateId, getUserById);

router.post("/users", createUser);

router.patch("/users/:id", validateId, updateUser);

router.delete("/users/:id", validateId, deleteUser);

router.post(
  "/upload-image/:id",
  upload.single("file"),
  validateId,
  (req, res, next) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    fileUpload(req, res);
  }
);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size exceeds the 2MB limit." });
    }
  } else if (err.message === "Only Images are allowed (jpeg, jpg, png)") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});
module.exports = router;
