const Vendor = require("../../models/vendor");
const { connection_failed } = require("../../../../common/StatusCode");

class VendorDatabase {
  /**
   * Database call for inserting user information
   * @param {*} req (user details)
   * @param {*} res (json with success/failure)
   */
  async vendorList(info) {
    // const vendor = new Vendor(info);
    try {
      let details;
      if (info._id)
        details = await Vendor.findById(info._id).sort({ _id: -1 }).limit(5);
      else details = await Vendor.findById().sort({ _id: -1 }).limit(5);
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * Database call for inserting user information
   * @param {*} req (user details)
   * @param {*} res (json with success/failure)
   */
  async getVendorDetails() {
    // const vendor = new Vendor(info);
    try {
      const details = await Vendor.findOne({ isNewer: true },'prefix emailAddress  vendorName');
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }
}

module.exports = {
  vendorDatabase: function () {
    return new VendorDatabase();
  },
};
