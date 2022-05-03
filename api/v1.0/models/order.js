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
            default: 1,
          },
          price: { type: Number, required: true },
          discounted_price: { type: Number },
          img: { type: String },
        },
      ],
      paymentInfo: {
        amount: { type: Number, required: true },
        tax: { type: Number, required: true },
        total: { type: Number, required: true },
        stripeTransactionId: { type: String },
      },

      billingInfo: {
        fullname: { type: String },
        contactNumber: { type: String },
        emailAddress: { type: String },
        address: {
          type: String,
          default:
            "H NO.-44-3-456/7, STREET NO.-2, XYZ COLONY, MUMBAI, MAHARASHTRA, 324532, India",
        },
        deliveryDate: { type: String },
      },

      status: { type: String, default: "pending" },
    },
    { timestamps: true, collection: `${prefix}order` }
  );
  return (
    mongoose.models[`${prefix}order`] ||
    mongoose.model(`${prefix}order`, orderSchema)
  );
}

module.exports = dynamicSchema;

// const Order = mongoose.model("Order", OrderSchema);
// module.exports=Order
