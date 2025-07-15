const socket=require('socket.io');
const { User } = require('../../models/user');
const { Chat } = require('../../models/chatsdb');

const initialisesocket=(server)=>{

const io=socket(server,{
cors:{
    origin:"http://localhost:5173"
}
})
io.on("connection",(socket)=>{
    
    socket.on("joinchat",({toId,userid})=>{   //received data from frontend....
        const roomid=[toId,userid].sort().join('_'); //sort to make room id for chat same...
        socket.join(roomid);
    });    


     socket.on("sendmsg",async({firstname,targetid,userid,text})=>{
    
        let chat=await Chat.findOne({participants:{$all:[targetid,userid]}});

        if(!chat){
            chat=new Chat({
                participants:[userid,targetid],
               messages:[]
            })
        } 

        chat?.messages?.push({senderid:userid,text:text});
        await chat.save();
         
   const roomid=[targetid,userid].sort().join('_');
   const other=await User.findOne({_id:userid});
 
     io.to(roomid).emit("msg received",{firstname,userid,text,photourl:other?.photourl}) //means send msg to all sockets in room, now 
                                       // its choice of user to receive them at frontend using "msg rec handler"
     });

})


}



module.exports= initialisesocket