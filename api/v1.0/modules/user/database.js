const Vendor = require("../../models/vendor");
// const Category = require("../../models/category");
// const Product = require("../../models/product");
const CategorySchema = require("../../models/category");
const ProductSchema = require("../../models/product");
const config = require("../../../../config");
const { connection_failed } = require("../../../../common/statusCode");
const Cart = require("../../models/cart");
const stripe = require("stripe")(config.stripeKey);


class UserDatabase {
  /**
   * Database call for getting category List
   * @param {*} req (user details)
   * @param {*} res (json with success/failure)
   */
  async categoryList(info) {
    const query = info.query;
    const Category = CategorySchema(query.prefix);

    let limit = 10;
    let skip = 0;

    if (query.limit) {
      limit = Number(query.limit);
    }

    if (query.skip) {
      skip = Number(query.skip);
    }

    // condition = { vendorId: query.vendorId };
    try {
      const details = await Category.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
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
   * Database call for getting product List
   * @param {*} req (user details)
   * @param {*} res (json with success/failure)
   */
  async productList(info) {
    let query = info.query;
    let condition = {};
    const Product = ProductSchema(query.prefix);

    let limit = 10;
    let skip = 0;

    if (query.limit) {
      limit = Number(query.limit);
    }

    if (query.skip) {
      skip = Number(query.skip);
    }

    if (query.category) {
      condition = {
        categories: { $in: [query.category] },
      };
    }

    try {
      const details = await Product.find(condition)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
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
   * Database call for getting product List
   * @param {*} info (user details)
   * @param {*} res (json with success/failure)
   */
  async orderList(info) {
    let query = info.query;
    let condition = {};
    const Order = OrderSchema(query.prefix);

    let limit = 10;
    let skip = 0;

    if (query.limit) {
      limit = Number(query.limit);
    }

    if (query.skip) {
      skip = Number(query.skip);
    }

    condition = {
      userId: query.userId,
    };

    try {
      const details = await Order.find(condition)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
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
   * Database call for getting product List
   * @param {*} info (user details)
   * @param {*} res (json with success/failure)
   */
   async getCart(info) {
    let query = info.query;
    let condition = {};
    const Cart = CartSchema(query.prefix);

    condition = {
      userId: query.userId,
    };

    try {
      const details = await Cart.find(condition);
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
   * Database call for getting product List
   * @param {*} info (user details)
   * @param {*} res (json with success/failure)
   */
   async getVendorDetails(info) {
    let query = info.query;
    let condition = {};

    // condition = {
    //   vendorId: query.vendorId
    // };

    try {
      const details = await Vendor.findById(query.vendorId);
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
   * Database call for getting product List
   * @param {*} info (user details)
   * @param {*} res (json with success/failure)
   */
   async stripePayment(info) {
    // let query = info.query;
    // let condition = {};

    // condition = {
    //   vendorId: query.vendorId
    // };

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success.html',
        cancel_url: 'http://localhost:3000/cancel.html',
      });
      return session;
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
