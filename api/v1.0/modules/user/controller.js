const object = require('./user');
const functions = require('../../../../common/functions');

const controller = {
  //Category List
  categoryList: async (req, res, next) => {
    try {
      const registrationDetails = await object
        .userService()
        .categoryList(req);
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
  productList: async (req, res, next) => {
    try {
      const registrationDetails = await object
        .userService()
        .productList(req);
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
  orderList: async (req, res, next) => {
    try {
      const registrationDetails = await object
        .userService()
        .orderList(req);
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
  getCart: async (req, res, next) => {
    try {
      const registrationDetails = await object
        .userService()
        .getCart(req);
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
    try {
      const registrationDetails = await object
        .userService()
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
  },
  payment: async (req, res, next) => {
    try {
      const registrationDetails = await object
        .userService()
        .payment(req);
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