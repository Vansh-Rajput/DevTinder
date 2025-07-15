
const mongoose=require('mongoose');
const { User } = require('./user');

const messageschemma=mongoose.Schema({
    senderid:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User",
     required:true
    },
    text:{
      type:String,
         ref:"User",
         required:true
    }
},{timestamps:true})

const chatschemma=mongoose.Schema({
    participants:[   //make participants as array so that in future we may add more than 2 people
        {
            type:mongoose.Schema.Types.ObjectId,ref:"User",required:true
        }
    ],
    messages:[messageschemma]
})

const Chat=mongoose.model("Chat",chatschemma);
module.exports={Chat}


// currently we are considering 2 users chat only, it means each document or object will have a participant
// array with exact 2 entries in it, [obj1.id,obj2.id].....

// no need to specify [userid: , targetid: ] inside array itself then we would have to make complex
// queries while searching, as user,target maybe stored in any manner at first..... so precise query is needed
//  by $and $or, but now we just need $all