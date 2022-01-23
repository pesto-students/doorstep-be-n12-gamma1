const router = require('express').Router();
const api = require('./controller');
const auth=require('../../../../common/authentication');


// Middle layer for Auth API
router.get('/categoryList',auth.validateToken,api.categoryList);
router.get('/productList',auth.validateToken,api.productList);
router.get('/orderList',auth.validateToken,api.orderList);
router.get('/vendorDetails',auth.validateToken,api.getVendorDetails);
router.get('/cartDetails',auth.validateToken,api.getCart);
router.post('/payment',auth.validateToken,api.payment);

module.exports = router;