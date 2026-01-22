const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.auth.controller");

router.post("/login", adminController.login);
router.post("/register", adminController.register); // optional

module.exports = router;
