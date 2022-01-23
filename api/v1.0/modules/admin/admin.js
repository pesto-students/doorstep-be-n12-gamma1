const validator = require("validator");
const statusCode = require("../../../../common/StatusCode");
const message = require("../../../../common/message");
const fs = require("fs");
const db = require("./database");
const xlsx = require("xlsx");
const functions = require("../../../../common/functions");

class AdminService {
  /**
   * API for user registration
   * @param {*} req (user detials)
   * @param {*} res (json with success/failure)
   */
  async uploadFile(info) {
    try {
      if (!info.files) {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: [],
        };
      }

      const fileURL = await db.adminDatabase().uploadFile(info);
      const file = xlsx.readFile(fileURL);

      // let cust = (xlsx.utils.sheet_to_json(file.Sheets["Vendor Details"])[0]['Vendor Name']).split("");
      // let DB_NAME=`DoorStep_${cust[0]}_${cust[1]}`;
      // const conn = await connection(DB_NAME)

      const sheets = file.SheetNames;
      let vendorDetails, categoryDetails, productDetails, prefix;
      const data = {
        vendor_details: [],
        categories: [],
        products: [],
      };
      for (let i = 0; i < sheets.length; i++) {
        let sheetData = xlsx.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]]
        );
        
       
        if (file.SheetNames[i] === "Vendor Details") {
          prefix = await functions.getPrefix(sheetData[0]['Vendor Name']);
          sheetData[0].fileURL=fileURL;
          vendorDetails = await db
            .adminDatabase()
            .vendorRegistration({ vendor: sheetData, prefix: prefix });
        } else if (file.SheetNames[i] === "Categories") {
          categoryDetails = await db
            .adminDatabase()
            .addCategory({
              category: sheetData,
              prefix: prefix
            });
        } else {
          productDetails = await db
            .adminDatabase()
            .addProduct({
              product: sheetData,
              prefix: prefix
            });
        }
      }
      return {
        statusCode: statusCode.success,
        message: message.success,
        data: {
          "Vendor Details": vendorDetails,
          "Category Details": categoryDetails,
          "Product Details": productDetails,
        },
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
  adminService: function () {
    return new AdminService();
  },
};
