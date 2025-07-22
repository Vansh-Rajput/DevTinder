
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');

const userschema=mongoose.Schema({
    first_name:{
    type:String,
    required:true      //used to make field mandatory, else mongoose will not allow insertion
    },
    last_name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,       //removes space automatically
    },
    password:{
        type:String,
        required:true,
    },
    photourl:{
        type:String,
        default:"https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
    },
    gender:{
        type:String, 
        enum:{
         values:["male","female","others"],
         message:'{VALUE} is invalid'
        }
    },
    about:{
        type:String,
    },
    ispremium:{
     type:Boolean,
     default:"false"
    }
},{timestamps:true});


// create methods at schema level and use them
userschema.methods.getjwt=async function(){
    const token=await jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"7d"});  
    return token;
}

// 1st para is name of collection in mDB that u wanna give, 2nd is schema name written above.....
const User=mongoose.model('User',userschema);   //to use the schema definition we create model out of it to further create doc..
module.exports={
    User
}


