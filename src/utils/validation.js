
const validator=require('validator');
const { User } = require('../../models/user');

//create validation logic separatly and just call the func to use it, avoid putting everything in schema itself
const validatesignup=(req)=>{

    const {first_name,last_name,email,password}=req.body;

    if(!first_name.length || !last_name)
        throw new Error('write valid name'); 

    else if(!validator.isEmail(email))
        throw new Error("invalid email");

     else if(password.length<4)
        throw new Error("use password of atleast 4 characters");

}



const isvalid=(data)=>{
   
    const allowedchange=["age","photourl","gender"];

   return Object.keys(data).every((val)=>allowedchange.includes(val));  // .every gives false and stop checking if 1 of them gives false
 
}


module.exports={
    validatesignup,isvalid
}