const express= require("express");
const { Auth } = require("../src/middlewares/auth");
const {validatesignup}=require("../src/utils/validation");
const { User } = require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");


const authroute=express.Router();


 // POST DATA IN DB dynamically
authroute.post('/signup',async(req,res,next)=>{
    console.log(req.body);
    
        // const obj=new User({         //create new instance out of model
        //        first_name:'vansh',
        // last_name:'rajput',
        // age:20,
        // email:'v@gmail.com',
        // })
    
        try{
        validatesignup(req);
    
        const {first_name,last_name,age,email,password}=req.body;
        const hashed=await bcrypt.hash(password,10);
    
        //better way of pushing the fields, if any random is used, it would be ignored...
    const obj=new User({
        first_name,last_name,age,email,password:hashed
    });                              //new way, provide the body in postman and use the express.json method,.....
                                     //by using this method we could use body of postman itself for operation
    
    await obj.save();      //add object to DB
    res.send('Done !!!')
        }
        catch(err){
            res.status(401).send('ERROR: '+ err.message);
        }
})



authroute.post('/login',async(req,res,next)=>{
        try{
        const {email,password}=req.body;
    
        const info=await User.findOne({email:email});      //returns doc in form of js object {just 1 if multiple}
       
        if(!info)
            throw new Error('user doesnt exists');
    
        const ispass=await bcrypt.compare(password,info.password);   //works only for comparing plain text with hashed passwords
    
        if(!ispass)
            throw new Error('incorrect password')
    
        const jwttoken= await info.getjwt();   //creating jwt token throug schema level methods
        res.cookie("token",jwttoken);   
        res.send("login successful");
    
    }
    
    catch(err){
        res.status(401).send('Error: ' + err.message);
    }

})


authroute.post('/logout',Auth,async(req,res,next)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});  //expires removes completely in postman according to time
   res.send('Logged Out !!');
})



module.exports={authroute}