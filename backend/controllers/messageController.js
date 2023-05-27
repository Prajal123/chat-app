const asyncHandler=require('express-async-handler');
const Message=require('../models/Messages');
const User=require('../models/User');
const Chat=require('../models/ChatModel');

 const sendMessage=asyncHandler(async(req,res)=>{
   const {content,chatId}=req.body;

   if(!content || !chatId){
    res.status(400).json("Invalid Message");
   }
   try{

    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
     var message=await Message.create(newMessage);
        message=await message.populate("sender","name pic");
        message=await message.populate("chat");
        message=await User.populate(message,{
            path:'chat.users',
            select:"name pic email"
        })

        await Chat.findByIdAndUpdate(chatId,{latestMessage:message});
        res.json(message);
   }catch(err){

    res.status(400);
    throw new Error("Some error occured");
   }
})

 const allMessages=asyncHandler(async(req,res)=>{
     try{
        var messages=await Message.find({chat:req.params.chatId}).populate("sender","name pic").populate("chat");
        res.json(messages);
     }catch(err){
         res.status(400);
         throw new Error("Some error occured");
     }
})


module.exports={sendMessage,allMessages};