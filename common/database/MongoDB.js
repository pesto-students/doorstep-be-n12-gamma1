const mongoose=require("mongoose");
const { mongoDBConnectionStringCloud } =require("../../config");


mongoose.connect(mongoDBConnectionStringCloud,{useNewUrlParser:true});

const db=mongoose.connection;

db.on('error',(err)=>{
    console.log("Mongoose Connection error : ",err);
});

db.on('connected',()=>{
    console.log("Monggose DB Connected")
});

db.on('disconnected',()=>{
    console.log("Monggose DB Disconnected")
});

module.exports=db;