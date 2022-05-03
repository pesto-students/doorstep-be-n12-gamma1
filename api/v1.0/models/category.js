const mongoose = require("mongoose");

function dynamicSchema(prefix) {
  const categorySchema = mongoose.Schema(
    {
      categoryName: {
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
    },
    { timestamps: true, collection: `${prefix}category` }
  );

  return (
    mongoose.models[`${prefix}category`] ||
    mongoose.model(`${prefix}category`, categorySchema)
  );
}

module.exports = dynamicSchema;

// const Category = mongoose.model("Category", categorySchema);
// module.exports=Category

// module.exports = (conn) => conn.model('Category', categorySchema)
