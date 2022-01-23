const router=require("express").Router();
const authRouter=require("./modules/auth/routes");
const adminRouter=require("./modules/admin/routes");
const userRouter=require("./modules/user/routes")

router.get("/",(req,res)=>{
    res.status(200).json("Get API From @DoorStep !!!")
});

router.post("/",(req,res)=>{
    res.status(200).json("Post API From @DoorStep !!!")
})
router.use("/auth",authRouter);
router.use("/admin",adminRouter);
router.use("/user",userRouter);

module.exports=router;