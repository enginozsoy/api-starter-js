/**
 * Module dependencies.
 */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const routes = require("./routes");

/**
 * Load configurations as environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env" });

/**
 * Express configuration.
 */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable("x-powered-by");
app.use(routes);

/**
 * Middleware setup
 */
require("./middleware/auth");

/**
 * Connect to MongoDB.
 */
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("error", err => {
  console.error(err);
  console.log(
    "✗ MongoDB connection error. Please make sure MongoDB is running."
  );
  process.exit();
});

/**
 * Error Handler.
 */
if (process.env.NODE_ENV !== "development") {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Server Error");
  });
}

/**
 * Start Express server.
 */
app.listen(process.env.PORT || 3000, () => {
  console.log(
    "✓ App is running at http://localhost:%d in %s mode",
    process.env.PORT,
    process.env.NODE_ENV
  );
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;
