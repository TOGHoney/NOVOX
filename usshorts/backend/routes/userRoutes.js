const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {getProfile, updateProfile} = require("../controllers/userController");

// GET /api/users/profile
router.get("/profile", protect, getProfile);

// PUT /api/users/profile
router.put("/profile", protect, updateProfile);

module.exports = router;