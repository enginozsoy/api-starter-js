const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

// Create Schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      validate: [
        {
          validator: validator.isEmail,
          message: "Please fill a valid email address",
          isAsync: false
        },
        {
          validator: function() {
            return new Promise((res, rej) => {
              User.findOne({ email: this.email, _id: { $ne: this._id } })
                .then(data => {
                  if (data) {
                    res(false);
                  } else {
                    res(true);
                  }
                })
                .catch(err => {
                  res(false);
                });
            });
          },
          message: "Email address is already in use"
        }
      ]
    },
    password: {
      type: String,
      required: true
    },
    name: String
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", async function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.validatePassword = async function(candidatePassword) {
  const user = this;
  const compare = await bcrypt.compare(candidatePassword, user.password);
  return compare;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
