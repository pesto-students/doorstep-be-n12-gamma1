const mongoose = require("mongoose");

function dynamicSchema(prefix) {
  const orderSchema = mongoose.Schema(
    {
      userId: { type: String, required: true },
      products: [
        {
          productId: {
            type: String,
          },
          quantity: {
            type: Number,
            default: 1
          },
          price:{ type: Number, required: true },
          img: { type: String }
          
        },
      ],
      amount: { type: Number, required: true },
      address: { type: Object, required: true },
      status: { type: String, default: "pending" },
    },
    { timestamps: true, collection: `${prefix}order` }
  );
  return mongoose.models[`${prefix}order`] || mongoose.model(`${prefix}order`, orderSchema);
}

module.exports = dynamicSchema;

// const Order = mongoose.model("Order", OrderSchema);
// module.exports=Order
