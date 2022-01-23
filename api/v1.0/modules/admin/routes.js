const router = require('express').Router();
const api = require('./controller');
const auth=require('./../../../../common/authentication');


// Middle layer for Auth API
router.post('/uploadFile',auth.validateToken,api.uploadFile)

module.exports = router;