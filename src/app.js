require('dotenv').config()
const express=require('express');
const {connectdb}=require('./config/database');        //import the cluster from database.js
const { User } = require('../models/user');
const cookieParser = require('cookie-parser');
const { authroute } = require('../routes/authroute');
const { profileroute } = require('../routes/profile');
const { requestroute } = require('../routes/requests');
const { userroute } = require('../routes/userRoute');
const http= require('http')
const app=express();            
const cors=require('cors');
const initialisesocket = require('./utils/socket');
const {paymentroute} = require('../routes/payment');



//socket and socket.io

const server=http.createServer(app);
initialisesocket(server);


//first connect to db, then start accepting the api calls made to server...
connectdb().
then(()=>{
    console.log("connected to database");
    server.listen(3333,()=>console.log('server built'));   //best way to handle DB connection, ON your server
}).                                                    //only when DB is initialised with data, else problem
catch((err)=>{
console.log("error in loading database")
})


//app.use(express.json()) is a built-in middleware function in Express.js.
//It is used to parse incoming JSON request bodies and makes the parsed data available in req.body.
 app.use(express.json());    
app.use(cookieParser()); 
 

// we want routes to always work
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use('/',authroute);
app.use('/',profileroute);
app.use('/',requestroute);
app.use('/',userroute);
app.use('/',paymentroute);


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

