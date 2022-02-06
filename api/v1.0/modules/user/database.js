const Vendor = require("../../models/vendor");
// const Category = require("../../models/category");
// const Product = require("../../models/product");
const CategorySchema = require("../../models/category");
const ProductSchema = require("../../models/product");
const OrderSchema=require("../../models/order")
const config = require("../../../../config");
const { connection_failed } = require("../../../../common/StatusCode");
const Cart = require("../../models/cart");
const stripe = require("stripe")(config.stripeKey);
const db = require("../../../../common/database/MongoDB");


class UserDatabase {
  /**
   * Database call for getting category List
   * @param {*} req (user details)
   * @param {*} res (json with success/failure)
   */
  async categoryList(info) {
    const query = info.query;
    const Category = CategorySchema(query.prefix);
    // const modelName=`${query.prefix}category`;
    // const Category = db.collection(modelName)
    

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
      // const details = await Category.find()
      //   .sort({ _id: -1 })
      //   .skip(skip)
      //   .limit(limit);
      const details=await Category.aggregate([
        {
          $lookup: {
            from: `${query.prefix}product`,
            localField: "categoryName",
            foreignField: "categories",
            as: "products"
          }
        },
        {
          $project: {
            _id: 1,
            categoryName: 1,
            number_of_product: {
              $size: "$products"
            }
          }
        }
      ])
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

    let limit = 6;
    let skip = 0;

    if (query.limit) {
      limit = Number(query.limit);
    }

    if (query.skip) {
      skip = Number(query.skip);
    }

    if (query.category!=null) {
      const category=query.category.replace("%","");
      condition = {
        categories: { $in: [category] },
      };
    }


    if (query.productName!=null) {
      condition.title= new RegExp(query.productName,'i')
    // {"name": /.*m.*/}
    }
  console.log("condition",condition)
    try {
      const details = await Product.find(condition);
        // .sort({ _id: 1 })
        // .skip(skip)
        // .limit(limit);
      // "productList": [
      //   { "$match": condition },
      //   { "$skip": skip },
      //   { "$limit": limit }
      // ],
      // const details=await Product.aggregate([
      //   { "$facet": {
      //     "productList": [
      //       { "$match": condition }
      //     ],
      //     "totalCount": [
      //       { "$count": "count" }
      //     ]
      //   }}
      // ])
      // if(details && details.length!=0)
      //   return {productList:details[0].productList,totalCount:details[0].totalCount[0].count};
      // else  
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

    if (query.orderId) {
      condition = {
        _id: query.orderId
      };
    }

    // condition = {
    //   userId: query.userId,
    // };

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

  /**
   * Database call for getting product List
   * @param {*} req (user details)
   * @param {*} res (json with success/failure)
   */
   async addOrder(info,paymentDetails) {
    let query = info.query;
    const Order = OrderSchema(query.prefix);

    let product_data=[];
    info.body.productList.map((product)=>{
     let data={ productId: product._id,
      quantity: product.qty,
      price:product.price,
      discounted_price:product.discounted_price,
      img: product.img
    }
    product_data.push(data);
    })

    let concat_Address=info.body.deliveryInfo.address.length!=0?`${info.body.deliveryInfo.address}, ${info.body.deliveryInfo.city}, ${info.body.deliveryInfo.stateCountry} - ${info.body.deliveryInfo.zipCode}`:null;
    let fullName=info.body.deliveryInfo.firstname.length!=0?`${info.body.deliveryInfo.firstname} ${info.body.deliveryInfo.lastname}`:info.body.userInfo.fullName;
    let emailAddress=info.body.deliveryInfo.emailAddress.length!=0?info.body.deliveryInfo.emailAddress:info.body.userInfo.emailAddress;
    info.body.paymentInfo.stripeTransactionId=paymentDetails.id;
    const orderDetails={
      userId: info.body.userDetails.id,
      products: product_data,
      paymentInfo:info.body.paymentInfo,
      billingInfo:{
      fullname:fullName,
      contactNumber:info.body.deliveryInfo.contactNumber,
      emailAddress:emailAddress,
      address: concat_Address,
      deliveryDate:info.body.delivery_date
      }
    }
    const newOrder = new Order(orderDetails);

    // let limit = 10;
    // let skip = 0;

    // if (query.limit) {
    //   limit = Number(query.limit);
    // }

    // if (query.skip) {
    //   skip = Number(query.skip);
    // }

    // if (query.category!=null) {
    //   condition = {
    //     categories: { $in: [query.category] },
    //   };
    // }

    try {
      const details = await newOrder.save();
        // .sort({ _id: -1 })
        // .skip(skip)
        // .limit(limit);
        let data=[];
        data.push(details)
      return data;
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
