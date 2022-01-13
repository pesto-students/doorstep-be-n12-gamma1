const router=require("express").Router();
const authRouter=require("./modules/auth/routes")

router.get("/",(req,res)=>{
    res.status(200).json("Get API From @DoorStep !!!")
});

router.post("/",(req,res)=>{
    res.status(200).json("Post API From @DoorStep !!!")
})

router.use("/",authRouter);

module.exports=router;