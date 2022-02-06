const mongoose = require("mongoose");

function dynamicSchema(prefix) {
  const userSchema = mongoose.Schema(
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
    { timestamps: true, collection: `${prefix}user` }
  );
  return (
    mongoose.models[`${prefix}user`] ||
    mongoose.model(`${prefix}user`, userSchema)
  );
}

module.exports = dynamicSchema;

// const User = mongoose.model("User", userSchema);

// module.exports = User;
