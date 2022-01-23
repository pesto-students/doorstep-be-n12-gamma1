const object = require('./vendor');
const functions = require('../../../../common/functions');

const controller = {
  //Upload File API
  vendorList: async (req, res, next) => {
    console.log("req",req.files)
    try {
      const registrationDetails = await object
        .vendorService()
        .vendorList(req);
      res.send(
        functions.responseGenerator(
          registrationDetails.statusCode,
          registrationDetails.message,
          registrationDetails.data
        )
      );
    } catch (error) {
      return next(error);
    }
  },

  getVendorDetails: async (req, res, next) => {
    console.log("req",req.files)
    try {
      const registrationDetails = await object
        .vendorService()
        .getVendorDetails(req);
      res.send(
        functions.responseGenerator(
          registrationDetails.statusCode,
          registrationDetails.message,
          registrationDetails.data
        )
      );
    } catch (error) {
      return next(error);
    }
  }
}

  module.exports = controller;