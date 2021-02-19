const User = require("../models/User");
const validator = require("validator");
const jwt = require("jsonwebtoken");

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
  });

  // Validations on pre-save in the model

  newUser.save((err, user) => {
    if (err) {
      return res.status(400).json(err);
    }

    res.json(user);
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  if (!validator.isEmail(req.body.email))
    return res
      .status(400)
      .json({ Error: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    return res.status(400).json({ Error: "Password cannot be blank." });

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  // Find user by email
  User.findOne({ email: req.body.email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ Error: "Email not found" });
    }

    // Check password
    user.validatePassword(req.body.password).then((isValid) => {
      if (isValid) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          process.env.APP_SECRET,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ Error: "Password incorrect" });
      }
    });
  });
};
