const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/authMiddleware");
const {getProfile, updateProfile} = require("../controllers/userController");

// GET /api/users/profile
router.get("/profile", auth, getProfile);

// PUT /api/users/profile
router.put("/profile", auth, updateProfile);

module.exports = router;