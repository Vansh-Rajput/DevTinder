
const mongoose=require('mongoose');

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
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,       //remove space automatically
    },
    password:{
        type:String,
        required:true
    },
    photourl:{
        type:String,
        default:"https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg",
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value))
                throw new Error("invalid gender"); 
        }
    }
},{timestamps:true});

const User=mongoose.model('User',userschema);   //to use the schema definition we create model out of it to further create doc..
module.exports={
    User
}
