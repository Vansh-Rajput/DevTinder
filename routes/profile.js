
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

  await User.findByIdAndUpdate(req.detail._id,req.body);  //making sure we are dealing only with loggedin user

  res.send("updated successfully");
  
    }

    catch(err){
     res.status(401).send("ERROR : " + err.message)
    }
})

module.exports={profileroute}
