const dotenv=require("dotenv");
dotenv.config();

module.exports = {
    port: process.env[`${process.env.NODE_ENV}_PORT`],
    databaseUser: process.env[`${process.env.NODE_ENV}_DB_USER`],
    databasePassword: process.env[`${process.env.NODE_ENV}_DB_PASSWORD`],
    databaseName: process.env[`${process.env.NODE_ENV}_DB_NAME`],
    databasePort: process.env[`${process.env.NODE_ENV}_DB_PORT`],
    mongoDBConnectionStringLocal:
      process.env[`${process.env.NODE_ENV}_MONGO_URL_LOCAL`],
    mongoDBConnectionStringCloud:
      process.env[`${process.env.NODE_ENV}_MONGO_URL_CLOUD`],  
    tokenkey: process.env[`${process.env.NODE_ENV}_TOKEN_KEY`],
    bodyEncryption: false,
    supportEmail: process.env[`${process.env.NODE_ENV}_SUPPORT_EMAIL`],
    SMTPemailAddress: process.env[`${process.env.NODE_ENV}_SUPPORT_EMAIL`],
    SMTPPassword: process.env[`${process.env.NODE_ENV}_SUPPORT_EMAIL_PASSWORD`],
    cryptokey: process.env[`${process.env.NODE_ENV}_CRYPTO_KEY`],
    googleClientId:process.env[`${process.env.NODE_ENV}_CLIENT_ID`],
    backEndHost:process.env[`${process.env.NODE_ENV}_BACKEND_HOST`],
    stripeKey:process.env[`${process.env.NODE_ENV}_STRPE_SEC_KEY`]
  };