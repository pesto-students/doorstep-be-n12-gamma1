const Vendor = require("../../models/vendor");
const CategorySchema = require("../../models/category");
const ProductSchema = require("../../models/product");
const { connection_failed } = require("../../../../common/StatusCode");
const functions = require("../../../../common/functions");


class AdminDatabase {
  /**
   * Database call for inserting user information
   * @param {*} req (user details)
   * @param {*} res (json with success/failure)
   */
  async uploadFile(info) {
    try {
      const ConfigurationFile = info.files.ConfigurationFile;
      const fileType = ConfigurationFile.name.split(".")[1];
      const newFileName = `configuration-${new Date().getTime()}`;
      const pathInfo = "configuration/";
      const fileInformation = {
        fileName: newFileName,
        base64: ConfigurationFile.data,
        fileType: fileType,
        pathInfo: pathInfo,
      };
      const fileURLInfo = await functions.uploadFile(fileInformation);

      const details = fileURLInfo.fileName;

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
  async vendorRegistration(info) {
    const vendorDetails = info.vendor;
    const vendorArr = [];
    // const Vendor = VendorSchema(info.prefix);
    let formatedData;
    try {
      vendorDetails.forEach((res) => {
        
        formatedData = {
          propritorName: res["Propritor Name"],
          vendorName: res["Vendor Name"],
          typeOfVendor: res["Vendor Type"],
          emailAddress: res["email Id"],
          contactNumber: res["Contact No."],
          address_Details: {
            shopAddress: res["Address"],
            pincode: res["Pincode"],
            city: res["City"],
            state: res["State"],
            country: res["Country"],
          },
          template_Details: {
            logoUrl: res["fileURL"],
            primaryColor: res["Primary Color"],
            TextColor: res["Text Color"],
          },
          prefix:info.prefix,
          isNewer:true
        };
        vendorArr.push(formatedData);
      });

      const details = await Vendor.insertMany(vendorArr);
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
  async addCategory(info) {
    const categoryDetails = info.category;
    const categoryArr = [];
    const Category = CategorySchema(info.prefix);
    let formatedData;
    try {
      categoryDetails.forEach((res) => {
        formatedData = {
          categoryName: res["Category Name"]
        };
        categoryArr.push(formatedData);
      });
      const details = await Category.insertMany(categoryArr);
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
  async addProduct(info) {
    const productDetails = info.product;
    const productArr = [];
    const Product = ProductSchema(info.prefix);
    let formatedData;
    try {
      productDetails.forEach((res) => {
        let arr = [];
        if (res["Category"].includes(",")) {
          arr = res["Category"].split(",");
        } else {
          arr.push(res["Category"]);
        }
        formatedData = {
          title: res["Product Title"],
          desc: res["Desc"],
          categories: arr,
          unit: res["Unit"],
          price: res["Price"],
          stock: res["Total Stock"]
        };
        productArr.push(formatedData);
      });
      const details = await Product.insertMany(productArr);
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
  adminDatabase: function () {
    return new AdminDatabase();
  },
};
