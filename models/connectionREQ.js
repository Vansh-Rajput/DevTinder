
const mongoose=require('mongoose')
const { User } = require('./user');
const { Schema } = require('mongoose');

const connectschema=new mongoose.Schema({
   
    fromuserId:{
         type:mongoose.Schema.Types.ObjectId,    //storing object id
         required:true,
         ref:"User"
    },
    touserId:{
         type:mongoose.Schema.Types.ObjectId,
          required:true
    },
    status:{
        type:String, 
        required:true,
        enum:["accepted","rejected","ignored","interested"]   //enum means only these values are allowed
    }

},{timestamps:true})

const connection_model=new mongoose.model("connection_model",connectschema);

module.exports={
    connection_model
}