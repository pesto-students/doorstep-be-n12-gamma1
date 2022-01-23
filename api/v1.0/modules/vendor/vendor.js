const functions = require("../../../../common/functions");
const config = require("../../../../config");
const validator = require("validator");
const statusCode = require("../../../../common/statusCode");
const message = require("../../../../common/message");
const fs = require("fs");
const db = require("./database");
const xlsx = require("xlsx");
const Vendor = require("../../models/vendor");

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
  
        const vendorDetails = await db.vendorDatabase().getVendorDetails(info);
       
        return {
          statusCode: statusCode.success,
          message: message.success,
          data: vendorDetails[0],
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
