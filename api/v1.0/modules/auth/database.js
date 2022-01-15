const User = require('./schema');
const { connection_failed } = require('../../../../common/statusCode');

class UserDatabase {
    /**
     * Database call to check if user exists
     * @param {*} req (email address & mobileNumber)
     * @param {*} res (json with success/failure)
     */
    async checkIfuserExists(info) {
      try {
        const details = await User.find({ emailAddress: info });
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
    async userRegistration(info) {
      const user = new User(info);
      try {
        const details = await user.save();
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
    userDatabase: function () {
      return new UserDatabase();
    },
  };