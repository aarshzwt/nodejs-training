const express = require("express");
const { welcome, getUsers, createUser, getUserById, updateUser, deleteUser, fileUpload, createUserProfile, getUserProfileById, updateUserProfile, deleteUserProfile, deleteUserImages, userLogin } = require("../controllers/userController")
const validateId = require("../middleware/validateId")
const userValidator = require("../validators/userValidator");
const { userCreateSchema, userUpdateSchema, userProfileSchema, userLoginSchema, userGetSchema, userGetByIdSchema } = require("../ValidationSchema/userSchema");
const { imageUpload, handleMulterError } = require("../middleware/fileUpload");
const { authenticateToken } = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/", welcome);

//get routes
router.get("/users", userValidator(userGetSchema), authenticateToken, getUsers);
router.get("/users/:id", validateId, userValidator(userGetByIdSchema), authenticateToken, getUserById);
router.get("/user-profile/:id", validateId, authenticateToken,  getUserProfileById);

//sign-up Route(same as post user route), post routes:
router.post("/signup", userValidator(userCreateSchema),  createUser);

router.post("/user-profile/:userId", validateId, userValidator(userProfileSchema), authenticateToken,  createUserProfile);
router.post("/upload-image/:userId", imageUpload, validateId, authenticateToken,  fileUpload, handleMulterError);

//update routes
router.patch("/users/:id", validateId, userValidator(userUpdateSchema), authenticateToken,  updateUser);
router.put("/user-profile/:id", userValidator(userProfileSchema), authenticateToken,  updateUserProfile);

//delete routes
router.delete("/users/:id", validateId, authenticateToken,  deleteUser);
router.delete("/user-profile/:id", validateId, authenticateToken,  deleteUserProfile);
router.delete("/user-images/:userId", validateId, authenticateToken,  deleteUserImages);

//login-route:
router.post("/login", userValidator(userLoginSchema),  userLogin);



module.exports = router;
