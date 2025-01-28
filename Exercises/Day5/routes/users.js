const express = require("express");
const router = express.Router();
const validateId = require("../middlware/validateId");

const {
  welcome,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfileById,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  deleteUserImages
} = require("../controllers/userController");

router.get("/", welcome);

router.get("/users", getUsers);
router.get("/users/:id", validateId, getUserById);
router.post("/users", createUser);
router.patch("/users/:id", validateId, updateUser);
router.delete("/users/:id", validateId, deleteUser);


router.get("/user-profile/:id", validateId, getUserProfileById);
router.post("/user-profile/:id", createUserProfile);
router.put("/user-profile/:id", validateId, updateUserProfile);
router.delete("/user-profile/:id", validateId, deleteUserProfile);
router.delete("/user-images/:userId", validateId, deleteUserImages);

module.exports = router;
