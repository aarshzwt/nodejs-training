const express = require("express");
const multer = require("multer");

const router = express.Router();

const validateId = require("../middlware/validateId");
const userValidator = require("../validators/userValidator")
const { userCreateSchema, userUpdateSchema, userProfileSchema } = require("../database/schemas/userSchema")
const {
  welcome,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  fileUpload,
  getUserProfileById,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  deleteUserImages
} = require("../controllers/userController");

const {imageUpload, pdfUpload}  = require("../middlware/fileUpload");


router.get("/", welcome);

router.get("/users", getUsers);
router.get("/users/:id", validateId, getUserById);
router.post("/users", userValidator(userCreateSchema), createUser);
router.patch("/users/:id", userValidator(userUpdateSchema), updateUser);
router.delete("/users/:id", validateId, deleteUser);

router.post("/upload-image/:id", imageUpload, validateId,
  (req, res, next) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    fileUpload(req, res);
  }
);

router.post("/upload-pdf/:id", pdfUpload, validateId,
  (req, res, next) => {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    fileUpload(req, res);
  }
)

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

router.get("/user-profile/:id", validateId, getUserProfileById);
router.post("/user-profile/:id", userValidator(userProfileSchema), createUserProfile);
router.put("/user-profile/:id", userValidator(userProfileSchema), updateUserProfile);
router.delete("/user-profile/:id", validateId, deleteUserProfile);

router.delete("/user-images/:userId", validateId, deleteUserImages);

module.exports = router;
