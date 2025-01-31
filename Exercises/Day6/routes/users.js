const express = require("express");
const {welcome, getUsers, createUser, getUserById, updateUser, deleteUser, fileUpload, createUserProfile, getUserProfileById, updateUserProfile, deleteUserProfile, deleteUserImages} = require("../controllers/userController")
const validateId = require("../middleware/validateId")
const userValidator = require("../validators/userValidator");
const { userCreateSchema, userUpdateSchema, userProfileSchema } = require("../ValidationSchema/userSchema");
const { imageUpload, handleMulterError } = require("../middleware/fileUpload");
const router = express.Router();

router.get("/", welcome);

router.get("/users", getUsers);
router.get("/users/:id", validateId, getUserById);
router.post("/users", userValidator(userCreateSchema), createUser);
router.patch("/users/:id", validateId, userValidator(userUpdateSchema), updateUser);
router.delete("/users/:id", validateId, deleteUser);

router.get("/user-profile/:id", validateId, getUserProfileById);
router.post("/user-profile/:userId", userValidator(userProfileSchema), createUserProfile);
router.put("/user-profile/:id", userValidator(userProfileSchema), updateUserProfile);
router.delete("/user-profile/:id", validateId, deleteUserProfile);

router.post("/upload-image/:userId", imageUpload, validateId, fileUpload, handleMulterError);
router.delete("/user-images/:userId", validateId, deleteUserImages);

module.exports = router;
