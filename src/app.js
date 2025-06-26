const express=require('express');
const {connectdb}=require('./config/database');        //import the cluster from database.js

const { User } = require('../models/user');
const { validatesignup } = require('./utils/validation');
const bcrypt=require('bcrypt');
const cookieParser = require('cookie-parser');

const app=express();
const jwt=require("jsonwebtoken");
const { Auth } = require('./middlewares/auth');

//first connect to db, then start accepting the api calls made to server...
connectdb().
then(()=>{
    console.log("connected to database");
    app.listen(3333,()=>console.log('server built'));   //best way to handle DB connection, ON your server
}).                                                    //only when DB is initialised with data, else problem
catch((err)=>{
console.log("error in loading database")
})


//app.use(express.json()) is a built-in middleware function in Express.js.
//It is used to parse incoming JSON request bodies and makes the parsed data available in req.body.
 app.use(express.json());    

app.use(cookieParser()); 
 

 // POST DATA IN DB dynamically
app.post('/signup',async(req,res,next)=>{
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




// GET EMAIL OF USER using .find()
app.get('/user',async(req,res,next)=>{
     
    const mail=req.body.email;

try{
    const data= await User.find({email:mail});      //returns objects in form of array  //to get all documents use ({})
    if(data.length===0)
        res.status(401).send("user not found");
    else
res.send(data);
}
catch(e){
   res.status(401).send("something went wrong");
}
})




// UPDATE USER USING PATCH

app.patch('/user',async(req,res,next)=>{
   const id=req?.body?.userid;
  const data=req?.body;

   try{

    //we want to allow updation for these fields only, so setting up at api level itself
const Allowedchange=["userid","age","photourl","gender","password"];

 //here we converted members to array, then iterated to check the data body and confirmed the fields are with 
 //allowedchanges or not
const update=Object.keys(data).every((k)=>Allowedchange.includes(k)); 

if(!update)
throw new Error("updation not allowed");

await User.findByIdAndUpdate(id,data);

    res.send("Updated !!!")
   }
   catch(err){
    res.status(401).send('something went wrong while updating');
   }
})


// LOGIN Api
app.post('/login',async(req,res,next)=>{

    try{
    const {email,password}=req.body;

    const info=await User.findOne({email:email});      //returns doc in form of js object {just 1 if multiple}
   
    if(!info)
        throw new Error('user doesnt exists');

    const ispass=await bcrypt.compare(password,info.password);

    if(!ispass)
        throw new Error('incorrect password')

    const jwttoken= jwt.sign({_id:info._id},"devtin123");   //creating jwt tokens
    res.cookie("token",jwttoken);   
    res.send("login successful");

}

catch(err){
    res.status(401).send('Error: ' + err.message);
}

})


// READING COOKIE
app.get('/profile',Auth,(req,res,next)=>{

    try{ 
    res.send(req.detail)
    }

    catch(err){
    res.status(401).send("Error : " + err.message);
    }

})








// created an auth middleware, which will work for get,post and all other http methods 
// app.use('/admin',Auth)        //in case of .use() '/admin' works for all admin related / paths...

// app.get('/admin',(req,res,next)=>{
//      res.send('admin data');
// })

// app.get('/admin/getdata',(req,res,next)=>{
//      res.send('data recevied');
// })
 
////////////

// app.get("/user/:code",       // dynamic routing
//     (req,res,next)=>{  
//     console.log('server-1'); 

//  next();
// },
//   (req,res,next)=>{
//     console.log('server-2'); 

//  next();
// },   
//     (req,res,next)=>{  
//     console.log(req.params);  //get the dynamic part
//  res.send('hello from server-3')
// },

// )

