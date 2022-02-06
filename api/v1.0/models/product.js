const mongoose = require("mongoose");

function dynamicSchema(prefix) {
  const productSchema = mongoose.Schema(
    {
      title: { type: String, required: true, unique: true },
      desc: { type: String },
      img: { type: String },
      categories: { type: Array },
      size: { type: Array },
      unit: { type: String },
      price: { type: Number, required: true },
      discounted_price: { type: Number },
      stock: { type: Number, required: true },
      inStock: { type: Boolean, default: true },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true, collection: `${prefix}product` }
  );
  return (
    mongoose.models[`${prefix}product`] ||
    mongoose.model(`${prefix}product`, productSchema)
  );
}

module.exports = dynamicSchema;

// const Product = mongoose.model("Product", productSchema);
// module.exports=Product

// module.exports = (conn) => conn.model('Product', productSchema)
