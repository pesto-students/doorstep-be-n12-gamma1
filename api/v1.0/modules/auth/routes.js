const router = require("express").Router();
const api = require("./controller");
const auth = require("../../../../common/authentication");

// Middle layer for Auth API
router.post("/googlelogin", api.googlelogin);
// router.get('/logout',auth.validateToken,api.logout);

module.exports = router;
