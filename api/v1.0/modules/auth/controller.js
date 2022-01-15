const object = require('./auth');
const functions = require('../../../../common/functions');

const controller = {
  //User Registration API
  googlelogin: async (req, res, next) => {
    try {
      const registrationDetails = await object
        .authService()
        .googlelogin(req.body);
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