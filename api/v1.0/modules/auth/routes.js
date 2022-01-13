const router = require('express').Router();
const api = require('./controller');

// Middle layer for Auth API
router.post('/googlelogin', api.googlelogin);

module.exports = router;