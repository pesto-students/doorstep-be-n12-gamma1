var router = require('express').Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Welcome To @DoorSetp API !")
});

module.exports = router;
