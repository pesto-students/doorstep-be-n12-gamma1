const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    profileURL: String,
  },
  { timestamps: true, collection: "admins" }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
