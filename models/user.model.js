const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100,
    trim: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation function to check if confirmPassword matches password
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      this.confirmPassword = hashedPassword;
    }

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw createHttpError.InternalServerError(error.message);
  }
};
const User = mongoose.model("user", userSchema);
module.exports = User;
