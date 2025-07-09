
const express=require('express');
const { Auth } = require('../src/middlewares/auth');
const profileroute=express.Router();
const { User } = require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const { isvalid } = require('../src/utils/validation');



profileroute.get('/profile/view',Auth,(req,res,next)=>{
    try{ 
    res.send(req.detail)
    }

    catch(err){
    res.status(401).send("Error : " + err.message);
    }

})


profileroute.patch('/profile/edit',Auth,async(req,res,next)=>{

    try{
       if(!(isvalid(req.body)))
    throw new Error("changes not allowed")

       // this promise returns the old changes, to get new use:--
 const user=await User.findByIdAndUpdate(req.detail._id,req.body,{new:true}); 

  res.send(user);
  
    }

    catch(err){
     res.status(401).send("ERROR : " + err.message)
    }
})

module.exports={profileroute}
