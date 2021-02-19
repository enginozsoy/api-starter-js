const express = require("express");
const router = express.Router();

/**
 * Controllers (route handlers).
 */
const userController = require("./controllers/user");

/**
 * Routes
 */
router.post("/signup", userController.postSignup);
router.post("/login", userController.postLogin);

module.exports = router;
