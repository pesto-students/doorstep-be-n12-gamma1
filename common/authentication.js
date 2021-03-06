const functions = require("./functions");
const statusCode = require("./StatusCode");
const message = require("./message");
const redisClient=require('redisclient');

const authenticationController = {
  validateToken: async (req, res, next) => {
    try {
      if (req.headers.auth) {
        const tokenDecryptInfo = await functions.tokenDecrypt(req.headers.auth);

        if (tokenDecryptInfo.data) {
          res.locals.tokenInfo = tokenDecryptInfo.data;
          req.body.userDetails = tokenDecryptInfo.data;
          req.body.userDetails.token = req.headers.auth;
          // const data = await redisClient.redis.get(req.body.userDetails.id);
          // if (data !== null) {
          //   const parsedData = JSON.parse(data);
          //   if (!parsedData[userId].includes(token)) {
              const token = await functions.tokenEncrypt(tokenDecryptInfo.data);
              res.header("auth", token);
              next();
            // } else {
            //   throw {
            //     statusCode: statusCode.unauthorized,
            //     message: message.sessionExpire,
            //     data: null,
            //   };
            // }
          // }
        } else {
          throw {
            statusCode: statusCode.unauthorized,
            message: message.sessionExpire,
            data: null,
          };
        }
      } else {
        throw {
          statusCode: statusCode.bad_request,
          message: message.tokenMissing,
          data: null,
        };
      }
    } catch (error) {
      return next(error);
    }
  },

  validateAdmin: (req, res, next) => {
    try {
      if (res.locals.tokenInfo.isAdmin === 1) {
        next();
      } else {
        throw {
          statusCode: statusCode.unauthorized,
          message: message.unAuthorized,
          data: null,
        };
      }
    } catch (error) {
      return next(error);
    }
  },

  decryptRequest: (req, res, next) => {
    try {
      if (req.body) {
        const userinfo = functions.decryptData(req.body);
        res.locals.requestedData = userinfo;
        next();
      } else {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: null,
        };
      }
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = authenticationController;
