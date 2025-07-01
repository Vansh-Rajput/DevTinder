const express=require('express');
const { User } = require('../models/user');
const { Auth } = require('../src/middlewares/auth');
const { connection_model } = require('../models/connectionREQ');

const userroute=express.Router();

// get all pending requests for loggedin user ...
userroute.get('/user/requests',Auth,async(req,res,next)=>{
   
    try{
    const loggedin=req.detail;

    const pending=await connection_model.find({ 
      touserId:loggedin._id,         // if touserId it will give received, fromuserId gives that user had send
      status:"interested"
    }).populate("fromuserId",["first_name","last_name","photourl","age"])

     if(!pending || pending.length===0)     //since its an array, so length=0 means no request
        throw new Error("");

    res.send(pending);
}

catch(err){
  res.status(200).send("you have no connections currently");
}

})



userroute.get('/user/connections',Auth,async(req,res,next)=>{

       try{
    const loggedin=req.detail;

    const pending=await connection_model.find({ 
     $or:[
         {fromuserId:loggedin._id, status:"accepted"},
         {touserId:loggedin._id, status:"accepted"}
     ]
    }).populate("fromuserId",["first_name","last_name","photourl","age"])


     if(!pending || pending.length===0)     //since its an array, so length=0 means no request
        throw new Error("no connections");

    res.send(pending);
}

catch(err){
  res.status(404).send("Error : " +  err.message);
}


})

module.exports={
userroute
}