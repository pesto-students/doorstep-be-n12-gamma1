const Admin = require('../../models/admin');
const { connection_failed } = require('../../../../common/statusCode');
const CartSchema=require("../../models/cart");
const UserSchema = require("../../models/user");

class AuthDatabase {
    /**
     * Database call to check if Admin exists
     * @param {*} req (email address & mobileNumber)
     * @param {*} res (json with success/failure)
     */
    async checkIfUserExists(info) {
      let details;
      try {
        if(info==="Admin")
        details = await Admin.find({ emailAddress: info.emailAddress });
        else{
          const User=UserSchema(info.prefix);
          details = await User.find({ emailAddress: info.emailAddress });
        }
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
     * Database call for inserting admin information
     * @param {*} req (admin details)
     * @param {*} res (json with success/failure)
     */
    async userRegistration(info) {
      const admin = new Admin(info);
      try {
        const details = await admin.save();
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
     * Database call for inserting admin information
     * @param {*} req (admin details)
     * @param {*} res (json with success/failure)
     */
     async createCart(info) {
      const Cart=CartSchema(info.prefix);
      const cart = new Cart(info);
      try {
        const details=await cart.save();
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
    authDatabase: function () {
      return new AuthDatabase();
    },
  };