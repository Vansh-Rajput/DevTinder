// instead of writing auth logic inside the .get,.post methods, create it like this globally and next() to jump 
// whenever required..



const jwt=require("jsonwebtoken");
const { User } = require('../../models/user');


const Auth =async(req,res,next)=>{  

    try{
    const {token}=req.cookies;     //get the cookie token, the token of logged-in user will be now visible here, thanks to cookieparser()

    if(!token)
        throw new Error('Token is invalid, please login first')

  const payload=jwt.verify(token,"devtin123");   //got the id back use as payload object

  
  //add 1 more layer of security, what if user was banned or deleted just after our fetching of token?
  // token is just proof of pas authentication.

const {_id}=payload;
const detail=await User.findById(_id);

if(!detail)
    throw new Error("User not found");
        
 
req.detail=detail;   // VERY IMPORTANT!!!! ATTACH TO USE IN app.js '/profile', assigning to normal variables wont work, this is your loggedin user

  next();      //make use of next(), if condition satisfied, then only jump to other methods

}

catch(err){
res.status(401).send("Error : " + err.message);
}
}


module.exports={
Auth,
}