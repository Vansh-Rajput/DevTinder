const express=require('express');
const {connectdb}=require('./config/database');        //import the cluster from database.js

const { Auth } = require('./middlewares/auth');
const { User } = require('../models/user');

const app=express();

//first connect to db, then start accepting the api calls made to server...
connectdb().
then(()=>{
    console.log("connected to database");
    app.listen(3333,()=>console.log('server built'));   //best way to handle DB connection, ON your server
}).                                                    //only when DB is initialised with data, else problem
catch((err)=>{
console.log("error in loading database")
})


app.post('/signup',async(req,res,next)=>{
    const obj=new User({
           first_name:'vansh',
    last_name:'rajput',
    age:20,
    email:'v@gmail.com',
    })

await obj.save();
res.send('Done !!!')
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

