const functions = require("../../../../common/functions");
const config = require("../../../../config");
const validator = require("validator");
const statusCode = require("../../../../common/StatusCode");
const message = require("../../../../common/message");
const fs = require("fs");
const db = require("./database");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(config.googleClientId);

class AuthService {
  /**
   * API for user registration
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async googlelogin(info) {
    try {
      if (validator.isEmpty(info.tokenId)) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: null,
        };
      }
      const response = await client.verifyIdToken({
        idToken: info.tokenId,
        audience: config.googleClientId,
      });
      const { email_verified, name, email, picture } = response.payload;
      if (email_verified) {
        info.emailAddress=email;
        const checkIfUserExists = await db
          .authDatabase()
          .checkIfUserExists(info);

        if (checkIfUserExists.length > 0) {
          const userDetails = {
            fullName: checkIfUserExists[0].fullName,
            emailAddress: checkIfUserExists[0].emailAddress,
            role: checkIfUserExists[0].role,
            profileURL: checkIfUserExists[0].profileURL,
          };

          const token = await functions.tokenEncrypt({
            id: checkIfUserExists[0]._id,
            role: checkIfUserExists[0].role,
          });

          userDetails.token = token;
          if (userDetails.role === "Admin") {
            userDetails.sampleConfigurationFileUrl =
              config.backEndHost + "SampleConfigurationFile.xlsx";
          }

          return {
            statusCode: statusCode.success,
            message: message.registration,
            data: userDetails,
          };
        }
      }

     
      info.fullName = name;
      info.isEmailVerified = email_verified;
      info.profileURL = picture;
      const userRegistration = await db.authDatabase().userRegistration(info);
      if (userRegistration.role === "Admin") {
        userRegistration.sampleConfigurationFileUrl =
          config.backEndHost + "SampleConfigurationFile.xlsx";
      } else if (userRegistration.role === "User") {
        const cartDetails = await db
          .authDatabase()
          .createCart({ userId: userRegistration._id ,prefix:info.prefix});
      }

      let token = await functions.tokenEncrypt({
        id: userRegistration._id,
        role: userRegistration.role,
      });
      userRegistration.token = token;
      let emailMessage = fs
        .readFileSync("./common/emailtemplate/welcome.html", "utf8")
        .toString();
      emailMessage = emailMessage.replace("$fullname", info.fullName);

      functions.sendEmail(
        info.emailAddress,
        message.registrationEmailSubject,
        emailMessage
      );
      return {
        statusCode: statusCode.success,
        message: message.registration,
        data: userRegistration,
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
  authService: function () {
    return new AuthService();
  },
};
