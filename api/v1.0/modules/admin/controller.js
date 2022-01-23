const object = require('./admin');
const functions = require('../../../../common/functions');

const controller = {
  //Upload File API
  uploadFile: async (req, res, next) => {
    console.log("req",req.files)
    try {
      const registrationDetails = await object
        .adminService()
        .uploadFile(req);
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