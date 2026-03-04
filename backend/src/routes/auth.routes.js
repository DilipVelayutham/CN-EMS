const express = require("express");
const router = express.Router();

const {
  register,
  login,
  updateProfile
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/authOrganizer");

// Routes
router.post("/register", register);
router.post("/login", login);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
