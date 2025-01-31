const express = require("express");
const { welcome, getUsers, createUser, getUserById, updateUser, deleteUser, fileUpload, createUserProfile, getUserProfileById, updateUserProfile, deleteUserProfile, deleteUserImages, userLogin } = require("../controllers/userController")
const validateId = require("../middleware/validateId")
const userValidator = require("../validators/userValidator");
const { userCreateSchema, userUpdateSchema, userProfileSchema, userLoginSchema } = require("../ValidationSchema/userSchema");
const { imageUpload, handleMulterError } = require("../middleware/fileUpload");
const router = express.Router();

router.get("/", welcome);

//get routes
router.get("/users", getUsers);
router.get("/users/:id", validateId, getUserById);
router.get("/user-profile/:id", validateId, getUserProfileById);

//sign-up Route, post routes:
router.post("/users", userValidator(userCreateSchema), createUser);

router.post("/user-profile/:userId", userValidator(userProfileSchema), createUserProfile);
router.post("/upload-image/:userId", imageUpload, validateId, fileUpload, handleMulterError);

//update routes
router.patch("/users/:id", validateId, userValidator(userUpdateSchema), updateUser);
router.put("/user-profile/:id", userValidator(userProfileSchema), updateUserProfile);

//delete routes
router.delete("/users/:id", validateId, deleteUser);
router.delete("/user-profile/:id", validateId, deleteUserProfile);
router.delete("/user-images/:userId", validateId, deleteUserImages);

//login-route:
router.post("/login", userValidator(userLoginSchema), userLogin);



module.exports = router;
