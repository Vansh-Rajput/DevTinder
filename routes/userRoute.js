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
    }).populate("fromuserId",["first_name","last_name","photourl","age","email","about"])

     if(!pending || pending.length===0)     //since its an array, so length=0 means no request
        throw new Error("");

    res.send(pending);
}

catch(err){
  res.status(200).send("you have no connections pending currently");
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
    }).populate("touserId",["first_name","last_name","photourl","age","email","about"])
    .populate("fromuserId",["first_name","last_name","photourl","age","email","about"]);


     if(!pending || pending.length===0)     //since its an array, so length=0 means no request
        throw new Error("no connections");

        //array of objects, ensuring same logged in user is not returned...
          const data=pending.map((row)=>{
         if(row.fromuserId._id.toString() === loggedin._id.toString())
          return row.touserId
        
         return row.fromuserId;
    })

        res.send(data);
}

catch(err){
  res.status(404).send("Error : " +  err.message);
}


})


userroute.get('/user/feed',Auth,async(req,res,next)=>{
   
  try
  {
    const loggedin=req.detail;

    const pageno=req.query.pages;
    const limit=req.query.limit;
    const skipit=((pageno-1)*limit);

    const hidedata=new Set();
    const connections=await connection_model.find({
      $or:[
        {fromuserId:loggedin._id},
        {touserId:loggedin._id}
      ]
    })

    //handles all cases at once
    connections.forEach((val) => {
       hidedata.add(val.fromuserId);
      hidedata.add(val.touserId);
    });
 
    //
    const final=await User.find({
      $and:[
      {_id:{$nin : Array.from(hidedata)}},  //converting to array finally for comparing
      {_id:{$ne : loggedin._id}}
      ]
    }).select("first_name last_name age gender photourl about").skip(skipit).limit(limit);

       res.send(final)

  }

    catch(err){
         res.status(200).send(err.message);
    }
})



module.exports={
userroute
}







