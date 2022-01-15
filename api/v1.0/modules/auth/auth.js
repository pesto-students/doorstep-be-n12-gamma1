const functions = require('../../../../common/functions');
const config = require('../../../../config');
const validator = require('validator');
const statusCode = require('../../../../common/statusCode');
const message = require('../../../../common/message');
const fs = require('fs');
const db = require("./database");
const {OAuth2Client} =require("google-auth-library");
const client=new OAuth2Client(config.googleClientId)

class AuthService {
    /**
     * API for user registration
     * @param {*} req (user detials)
     * @param {*} res (json with success/failure)
     */
    async googlelogin(info) {
      try {
        if (
          validator.isEmpty(info.tokenId)
        ) {
          throw {
            statusCode: statusCode.bad_request,
            message: message.badRequest,
            data: null,
          };
        }
        const response=await client.verifyIdToken(
            {idToken:info.tokenId,audience:config.googleClientId}
            )
            const {email_verified,name,email,picture}=response.payload;
            if(email_verified){
                const checkIfuserExists = await db.userDatabase().checkIfuserExists(email);
  
        if (checkIfuserExists.length > 0) {
            const userDetails = {
                fullName: checkIfuserExists[0].fullName,
                emailAddress: checkIfuserExists[0].emailAddress,
                role: checkIfuserExists[0].role,
                profileURL:checkIfuserExists[0].profileURL
              };
        
              const token = await functions.tokenEncrypt(checkIfuserExists[0]._id);
        
              userDetails.token = token;
              
              return {
                statusCode: statusCode.success,
                message: message.registration,
                data: userDetails,
              };
        }
    }
  
        info.emailAddress=email;
        info.fullName=name;
        info.isEmailVerified=email_verified;
        info.profileURL=picture;
        const userRegistration = await db.userDatabase().userRegistration(info);
      
  
        let token = await functions.tokenEncrypt(userRegistration._id);
        userRegistration.token=token;
        let emailMessage = fs
          .readFileSync('./common/emailtemplate/welcome.html', 'utf8')
          .toString();
        emailMessage = emailMessage
          .replace('$fullname', info.fullName)
  
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