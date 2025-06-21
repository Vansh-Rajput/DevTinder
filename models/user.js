
const mongoose=require('mongoose');

const userschema=mongoose.Schema({
    first_name:{type:String},
    last_name:{type:String},
    age:{type:Number},
    email:{type:String},
})

const User=mongoose.model('User',userschema);   //to use the schema definition we create model out of it to further create doc..
module.exports={
    User
}