const functions = require("../../../../common/functions");
const config = require("../../../../config");
const validator = require("validator");
const statusCode = require("../../../../common/StatusCode");
const message = require("../../../../common/message");
const fs = require("fs");
const db = require("./database");
const xlsx = require("xlsx");


class UserService {
  /**
   * API for get caterory List
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async categoryList(info) {
    try {
      if (!info.query.prefix) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: [],
        };
      }

      const categoryList = await db.userDatabase().categoryList(info);

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: categoryList,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * API for get product List
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async productList(info) {
    try {
      if (!info.query.prefix) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: [],
        };
      }

      const productList = await db.userDatabase().productList(info);

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: productList,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * API for get order List
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async orderList(info) {
    try {
      if (!info.query.prefix) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: [],
        };
      }

      const orderList = await db.userDatabase().orderList(info);

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: orderList,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * API for get cart details
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async getCart(info) {
    try {
      if (!info.query.prefix) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: [],
        };
      }

      const cartDetails = await db.userDatabase().getCart(info);

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: cartDetails,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  /**
   * API for get cart details
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async getVendorDetails(info) {
    try {
      const vendorDetails = await db.userDatabase().getVendorDetails(info);

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: vendorDetails,
      };
    } catch (error) {
      throw {
        statusCode: error.statusCode,
        message: error.message,
        data: JSON.stringify(error),
      };
    }
  }

  async payment(info) {
    try {
    
      if (!info.query.prefix) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: [],
        };
      }
      const paymentDetails = await functions.stripePayment(info.body);
      const orderDetails = await db.userDatabase().addOrder(info,paymentDetails);

      return {
        statusCode: statusCode.success,
        message: message.success,
        data: orderDetails,
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
  userService: function () {
    return new UserService();
  },
};
