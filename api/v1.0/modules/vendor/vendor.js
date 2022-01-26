const statusCode = require("../../../../common/StatusCode");
const message = require("../../../../common/message");
const fs = require("fs");
const db = require("./database");
const Vendor = require("../../models/vendor");
const config = require("../../../../config");

class VendorService {
  /**
   * API for user registration
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async vendorList(info) {
    try {
      if (!info.vendorId) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: [],
        };
      }

      const vendorList = await db.vendorDatabase().vendorList(info);

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: vendorList,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  async getVendorDetails(info) {
    try {
      const vendorDetails = await db.vendorDatabase().getVendorDetails();
      if(vendorDetails){
        console.log("vendorDetails",vendorDetails)
      let data = vendorDetails.vendorName.toLowerCase().split(" ");
      let appName = "";
      data.forEach((element, index) => {
        appName =index==0?`${element}`:`${appName}-${element}`
      });
      vendorDetails._doc.envDetails = {
        REACT_APP_CLIENT_ID: config.googleClientId,
        REACT_APP_API_URL: config.reactApiUrl,
        REACT_APP_STRIPE_PUBLIC_KEY: config.reactStripeKey,
      };
      vendorDetails._doc.appName=appName
    }
      return {
        statusCode: statusCode.success,
        message: message.success,
        data: vendorDetails
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  async updateVendorDetails(info) {
    console.log("infoo",info)
    try {
      const updateVendor = await db.vendorDatabase().updateVendorDetails(info);

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: updateVendor,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }
}

module.exports = {
  vendorService: function () {
    return new VendorService();
  },
};
