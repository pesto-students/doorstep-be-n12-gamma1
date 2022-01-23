const dotenv=require("dotenv");
dotenv.config();

module.exports = {
    port: process.env['PORT'],
    databaseUser: process.env['DEV_DB_USER'],
    databasePassword: process.env['DEV_DB_PASSWORD'],
    databaseName: process.env['DEV_DB_NAME'],
    databasePort: process.env['DEV_DB_PORT'],
    mongoDBConnectionStringLocal:
      process.env['DEV_MONGO_URL_LOCAL'],
    mongoDBConnectionStringCloud:
      process.env['DEV_MONGO_URL_CLOUD'],  
    tokenkey: process.env['DEV_TOKEN_KEY'],
    bodyEncryption: false,
    supportEmail: process.env['DEV_SUPPORT_EMAIL'],
    SMTPemailAddress: process.env['DEV_SUPPORT_EMAIL'],
    SMTPPassword: process.env['DEV_SUPPORT_EMAIL_PASSWORD'],
    cryptokey: process.env['DEV_CRYPTO_KEY'],
    googleClientId:process.env['DEV_CLIENT_ID'],
    backEndHost:process.env['DEV_BACKEND_HOST'],
    stripeKey:process.env['DEV_STRPE_SEC_KEY']
  };