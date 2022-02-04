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
      const details = await Vendor.findOne({ isNewer: true },'prefix emailAddress vendorName template_Details');
      return details;
    } catch (error) {
      throw {
        statusCode: connection_failed,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  async updateVendorDetails(req) {
    try {
      const details = await Vendor.findByIdAndUpdate(
        req.params._id,
        {
          $set: {"isNewer":false,"siteUrl":"https://"+req.params.siteUrl+"-doorstep.herokuapp.com"}
        },
        { new: true }
      );
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
