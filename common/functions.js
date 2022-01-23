const config = require("../config");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const fs = require("fs");
const { errorHandler } = require("./error");
const { Promise } = require("mongoose");
const { rejects } = require("assert");
const stripe = require("stripe")(config.stripeKey);
const { v4: uuidv4 }=require("uuid")

/**
 * Function for Encrypting the data
 * @param {*} data (data to encrypt)
 * @param {*} return (encrypted data)
 */
function encryptData(data) {
  if (config.bodyEncryption) {
    var dataString = JSON.stringify(data);
    var response = CryptoJS.AES.encrypt(dataString, config.cryptokey);
    return { encResponse: response.toString() };
  }
  return data;
}

/**
 * Function for decrypting the data
 * @param {*} data (data to decrypt)
 * @param {*} return (decrypt data)
 */
function decryptData(data) {
  if (config.bodyEncryption) {
    var decrypted = CryptoJS.AES.decrypt(data, config.cryptokey);
    if (decrypted) {
      var userinfo = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      return userinfo;
    } else {
      return { userinfo: { error: "Please send proper token" } };
    }
  }
  return data;
}

/**
 * Function for Encrypting the password
 * @param {*} data (data to encrypt)
 * @param {*} return (encrypted data)
 */
function encryptPassword(data) {
  var response = CryptoJS.AES.encrypt(data, config.tokenkey);
  return response.toString();
}

/**
 * Function for decrypting the password
 * @param {*} data (data to decrypt)
 * @param {*} return (decrypt data)
 */
function decryptPassword(data) {
  var decrypted = CryptoJS.AES.decrypt(data, config.tokenkey);
  if (decrypted) {
    var userinfo = decrypted.toString(CryptoJS.enc.Utf8);
    return userinfo;
  } else {
    return { userinfo: { error: "Please send proper token" } };
  }
}

/**
 * Function for encryting the userId with session
 * @param {*} data (data to encrypt)
 * @param {*} return (encrypted data)
 */
async function tokenEncrypt(data) {
  var token = await jwt.sign({ data: data }, config.tokenkey, {
    expiresIn: 24 * 60 * 60,
  }); // Expires in 1 day
  return token;
}

/**
 * Function for decryting the userId with session
 * @param {*} data (data to decrypt)
 * @param {*} return (decrypted data)
 */
async function tokenDecrypt(data) {
  try {
    const decode = await jwt.verify(data, config.tokenkey);
    return decode;
  } catch (error) {
    return error;
  }
}

/**
 * Function for creating response
 * @param {*} data (status, data, token)
 * @param {*} return (encrypted data)
 */
function responseGenerator(statusCode, message, data = "") {
  var details = {
    statusCode: statusCode,
    message: message,
    result: data,
  };

  if (config.bodyEncryption) {
    return encryptData(details);
  } else {
    return details;
  }
}

/**
 * Function for sending email
 * @param {*} data (to, sub)
 * @param {*} return (decrypted data)
 */
async function sendEmail(to, subject, message) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.SMTPemailAddress,
      pass: config.SMTPPassword,
    },
  });

  var mailOptions = {
    from: "developers.winjit@gmail.com",
    to: to,
    subject: subject,
    html: message,
  };

  try {
    const smsDetails = await transporter.sendMail(mailOptions);
    return smsDetails;
  } catch (error) {
    errorHandler(error);
  }
}

/**
 * Function to randomly generate string
 * param
 * return (err, result)
 */
function generateRandomString(callback) {
  var referralCode = randomstring.generate({
    length: 9,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });
  callback(referralCode);
}

/* 
  Generate random string of specific size, 
  which used  for generating random password in create user by admin.
*/
function randomPasswordGenerater(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getPrefix(data){
  try{
  const uuid=uuidv4();
    const vendor=data.split(" ")[0]
    const prefix=`${vendor}_${uuid}_`;
    return prefix
  } catch (error) {
    return error;
  }
}

function stripePayment(data) {
  return new Promise(async (resolve, reject) => {
    try {
      // const [product,token]=data;
      // const idempotencyKey=uuidv4();
      const customer =await stripe.customers.create({
        email:data.token.email,
        source:data.token.id
      })
      //   const result=await stripe.paymentIntents.create({
      //     payment_method_types: ['card'],
      //     customer:customer.id,
      //     amount:data.amount,
      //     currency: "USD",
      //     receipt_email:data.token.email,
      //     payment_method: data.token.card.id,
      //     error_on_requires_action: true,
      //     confirm: true,
      // },{idempotencyKey});
      
     
      // resolve(result)
   
      
      await stripe.paymentIntents.create(
        {
          payment_method_types: ['card'],
          amount: data.amount,
          currency: "USD",
          receipt_email:data.token.email,
          payment_method:data.token.card.id,
          customer:customer.id,
          confirm: false
        },
        (stripeErr, stripeRes) => {
          if (stripeErr) {
            reject(stripeErr);
          } else {
            resolve(stripeRes);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Function for Uploading file
 * @param {*} data (image information)
 * @param {*} return (uploaded information)
 */
async function uploadFile(fileInfo) {
  try {
    const fileType = fileInfo.fileType;
    const fileName = `${fileInfo.fileName}.${fileType}`;
    // var base64 = fileInfo.base64.split(';base64,')[1];
    const base64 = fileInfo.base64;
    // var fileBuffer = new Buffer.from(base64, 'base64');
    if (!fs.existsSync("./public/" + fileInfo.pathInfo)) {
      await fs.mkdirSync("./public/" + fileInfo.pathInfo, { recursive: true });
    }
    await fs.writeFileSync(
      "./public/" + fileInfo.pathInfo + fileName,
      base64,
      "utf8"
    );
    return { fileName: "./public/" + fileInfo.pathInfo + fileName };
  } catch (e) {
    throw e;
  }
}

async function convertToJSON(array) {
  try {
    console.log("array", array[0]);
    var first = array[0].join();
    var headers = first.split(",");

    var jsonData = [];
    for (var i = 1, length = array.length; i < length; i++) {
      var myRow = array[i].join();
      var row = myRow.split(",");

      var data = {};
      for (var x = 0; x < row.length; x++) {
        data[headers[x]] = row[x];
      }
      jsonData.push(data);
    }
    return jsonData;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  encryptData,
  decryptData,
  encryptPassword,
  decryptPassword,
  tokenEncrypt,
  tokenDecrypt,
  responseGenerator,
  sendEmail,
  generateRandomString,
  randomPasswordGenerater,
  getPrefix,
  stripePayment,
  uploadFile,
  convertToJSON,
};
