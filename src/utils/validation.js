
const validator=require('validator');
const { User } = require('../../models/user');

//create validation logic separatly and just call the func to use it, avoid putting everything in schema itself
const validatesignup=(req)=>{

    const {first_name,last_name,email,password,age}=req.body;

    if(!first_name.length || !last_name.length)
        throw new Error('write valid name'); 

    else if(!validator.isEmail(email))
        throw new Error("invalid email");

     else if(password.length<4)
        throw new Error("use password of atleast 4 characters");

     else if(age<0 || age>100)
        throw new Error("please type a valid age")

}



const isvalid=(data)=>{
   
    console.log(data);
    const allowedchange=["first_name","last_name","age","photourl","gender","about"];

   const validkey= Object.keys(data).every((val)=>allowedchange.includes(val));  // .every gives false and stop checking if 1 of them gives false
 if(!validkey)
    return false;

 if(data?.age<0 || data?.age>100)
       throw new Error("please type a valid age")

 if(!data?.first_name || !data?.last_name)
       throw new Error("write valid name")

 else 
 return true;   //important to mention, else undefined would be send...
}


module.exports={
    validatesignup,isvalid
}