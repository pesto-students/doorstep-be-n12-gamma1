const mongoose = require("mongoose");

function dynamicSchema(prefix){
const cartSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true, collection: `${prefix}cart` }
);

return mongoose.models[`${prefix}cart`] || mongoose.model(`${prefix}cart`, cartSchema);
}

module.exports = dynamicSchema;

// const Cart = mongoose.model("Cart", CartSchema);
// module.exports=Cart
