const mongoose = require("mongoose");

// function dynamicSchema(prefix) {
const vendorSchema = mongoose.Schema(
  {
    propritorName: {
      type: String,
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    typeOfVendor: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
    },
    contactNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    address_Details: {
      shopAddress: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    template_Details: {
      logoUrl: {
        type: String,
        required: true,
      },
      primaryColor: {
        type: String,
        required: true,
      },
      TextColor: {
        type: String,
        required: true,
      },
    },
    siteUrl: {
      type: String,
      default: "http://localhost:3000/landingPage",
    },
    prefix: {
      type: String,
      required: true,
    },
    isNewer: {
      type: Boolean,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
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
  { timestamps: true, collection: "vendors" }
);

// module.exports = dynamicSchema;

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
