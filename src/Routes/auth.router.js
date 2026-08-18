const express = require("express")
const router = express.Router();
const authController = require("../Controller/auth.controller");
const { validateRegister, validateLogin } = require("../Middleware/validation.middleware");

router.post("/register", validateRegister, authController.registerUser);

router.post("/login", validateLogin, authController.loginUser);

router.post("/logout",authController.logoutUser);

module.exports = router;
