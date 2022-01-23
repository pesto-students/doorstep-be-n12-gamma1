const router=require("express").Router();

router.get('/', function(req, res, next) {
    res.send("Welcome To @DoorSetp API !")
  });
  
router.use("/v1.0",require("./v1.0"));

module.exports=router;