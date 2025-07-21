const mongoose=require('mongoose');
const { User } = require('./user');

const razorschemma=new mongoose.Schema({


    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
     paymentId:{
     type:String,
    },
    orderId:{
     type:String,
     required:true,
    },
    amount:{
        type:Number,
        required:true
    },
   currency:{
     type:String,
     required:true,
    },
    receipt:{
     type:String,
     required:true,
    },
    notes:{
        firstname:{
          type:String
        },
        lastname:{
          type:String
        },
        emailId:{
          type:String
        }
    },
    status:{
        type:String,
        required:true
    }

},{timestamps:true})

module.exports = new mongoose.model("payment",razorschemma);