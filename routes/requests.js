
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
 

      

     const loggeduser=await User.findOne({_id:fromuser});
     const today=new Date()?.toDateString();                // SUN july 27 2025 format by .toDateString
     const lastdate=loggeduser?.lastswiped?.toDateString();

     //if swipe made on same day.....
     if(today==lastdate){
     if(loggeduser.swipecount>=2 && !(loggeduser.ispremium)){
      return res.status(200).json({message:false});
     }
      loggeduser.swipecount+=1;
    }
     
    //if swipe made on another day, then make sure to reset count...
    else{
        loggeduser.swipecount=1;
    }
   loggeduser.lastswiped=new Date();

await loggeduser.save();


    const data=new connection_model({
        fromuserId:fromuser,touserId:touser,status:state
    })

    await data.save();

  return res.status(200).json({message:true});
}

catch(err){
   res.status(401).send("Error : " + err.message)
}

})


requestroute.post('/request/review/:status/:reqId',Auth,async(req,res,next)=>{
    try{
       
        const loggedin=req.detail;
        const {status,reqId}=req.params;

         if(!["accepted","rejected","ignored"].includes(status))   //this is status from url
          throw new Error("invalid status")

        const requirements=await connection_model.findOne({
            _id:reqId,
            touserId:loggedin._id,
            status:"interested"              // our Db object
        })
   
        if(!requirements)
            throw new Error("request doesnt exists");

await connection_model.findByIdAndUpdate(reqId,{status:req.params.status},{new:true});
   

      res.send(status+" the request");
    }

    catch(err){
      res.status(401).send("Error : " + err.message);
    }
})



requestroute.post('/request/swipeundo',Auth,async(req,res,next)=>{
    try{
        const loggedin=req.detail._id;

    // -1 tells sort in decending order of created, means newest first, then store that doc in lastswipe...

        const lastswipe=await connection_model.findOne({fromuserId:loggedin,
         status:{$in:["ignored","interested"]}
        }).sort({createdAt:-1}).limit(1);  

        if(!lastswipe)
        return res.status(200).json({ message:false });


        const user=await User.findOne({_id:loggedin});
        user.swipecount-=1;
        await user.save();

        await connection_model.findByIdAndDelete({_id:lastswipe?._id});
        res.json({message:true})

    }

    catch(err){
      res.status(401).send("Error : Some Problem occured");
    }
})


module.exports={
    requestroute
}