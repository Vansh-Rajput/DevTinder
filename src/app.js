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


//app.use(express.json()) is a built-in middleware function in Express.js.
//It is used to parse incoming JSON request bodies and makes the parsed data available in req.body.
 app.use(express.json());    


 

 // POST DATA IN DB dynamically
app.post('/signup',async(req,res,next)=>{
    console.log(req.body);

    // const obj=new User({         //create new instance out of model
    //        first_name:'vansh',
    // last_name:'rajput',
    // age:20,
    // email:'v@gmail.com',
    // })

const obj=new User(req.body);  //new way, provide the body in postman and use the express.json method,.....
await obj.save();              //by using this method we could use body of postman itself for operations
res.send('Done !!!')
})




// GET EMAIL OF USER using .find()
app.get('/user',async(req,res,next)=>{
     
    const mail=req.body.email;

try{
    const data= await User.find({email:mail});      //data is in form of array    //to get all documents use ({})
    if(data.length===0)
        res.status(401).send("user not found");
    else
res.send(data);
}
catch(e){
   res.status(401).send("something went wrong");
}
})


// DELETE A USER BASE ON _ID
app.delete('/user',async(req,res,next)=>{
   const id=req.body.userid;

   try{
    await User.findByIdAndDelete(id);
    res.send("deleted !!!")
   }
   catch(err){
    res.status(401).send('something went wrong while deleting');
   }
})


// UPDATE USER USING PATCH

app.patch('/user',async(req,res,next)=>{
   const id=req.body.userid;
  const data=req.body;
   try{
await User.findByIdAndUpdate(id,data);

    res.send("Updated !!!")
   }
   catch(err){
    res.status(401).send('something went wrong while updating');
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

