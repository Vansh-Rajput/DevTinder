
const express=require('express');
const { User } = require('../models/user');
const { Auth } = require('../src/middlewares/auth');
const { connection_model } = require('../models/connectionREQ');

const requestroute=express.Router();

requestroute.post('/request/send/:status/:touserId',Auth,async(req,res,next)=>{

    try{
    const fromuser=req.detail._id;
    const touser=req.params.touserId;
    const state=req.params.status;

    if(!["ignored","interested"].includes(state))                      //this api is meant for interested/ignored only
      throw new Error("Invalid status, use only interested or ignore");

      const userexist=User.findById(touser);
     if(!userexist || touser==fromuser)
        throw new Error("user doesnt exists");

      // fixing duplicate requests and other side sending without response:    
      const exists=await connection_model.findOne({
       $or:[ 
         {fromuserId:fromuser , touserId:touser},    
          {fromuserId:touser , touserId:fromuser},
       ]
      }) 
        
      if(exists)
        throw new Error("connection already exists")
 

    const data=new connection_model({
        fromuserId:fromuser,touserId:touser,status:state
    })

    await data.save();

    res.send('connection request sent to Id : ' + touser);
}

catch(err){
   res.status(401).send("Error : " + err.message)
}

})


requestroute.post('/request/review/:status/:reqId',Auth,async(req,res,next)=>{
///////////////////////
    try{
       
        const loggedin=req.detail;
        const {status,reqId}=req.params;

         if(!["accepted","rejected"].includes(status))   //this is status from url
          throw new Error("invalid status")

        const requirements=await connection_model.findOne({
            _id:reqId,
            touserId:loggedin._id,
            status:"interested"              // our Db object
        })
   
        if(!requirements)
            throw new Error("request doesnt exists");

      const final = await connection_model.findByIdAndUpdate(reqId,{status:req.params.status});
      await final.save();

      res.send(status+" the request");
    }

    catch(err){
      res.status(401).send("Error : " + err.message);
    }
})

module.exports={
    requestroute
}