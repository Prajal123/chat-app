const asyncHandler=require('express-async-handler');
const Chat = require('../models/ChatModel');
const User=require('../models/User');

const accessChats=asyncHandler(async(req,res)=>{
    const {userId}=req.body;
    
    if(!userId){
        res.send("UserId param is not given");
        return;
    }

    var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users","-password").populate("latestMessage");

    isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email"
    })
    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData={
            isGroupChat:false,
             users:[userId,req.user._id]
        }
    }

    try{

      const createdChat=await Chat.create(chatData);
      const FullChat=await Chat.findOne({_id:createdChat.id}).populate("users","-password");
      res.status(200).send(FullChat);

    }catch(err){
        // res.status(401);
        // throw new Error("");
    }
})


const fetchChats=asyncHandler(async(req,res)=>{
  try{
    await Chat.find({users:{$elemMatch:{$eq:req.user.id}}}).populate("users").populate("latestMessage").populate("groupAdmin").sort({updatedAt:-1}).then(async(results)=>{
      await User.populate(results,{
        path:"latestMessage.sender",
        select:"name pic email"
      })
      res.status(200).send(results);
    })
  }catch(err){

  }
})

const createGroupChat=asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        res.send("Please fill all the details");
    }
    var users=JSON.parse(req.body.users);
    if(users.length<2){
        res.status(400).send("Users can not be less than 2");
    }
    users.push(req.user);
    try{
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            groupAdmin:req.user,
            isGroupChat:true
        })
        const FullChat=await Chat.find({_id:groupChat.id}).populate("users","-password").populate("groupAdmin");

        res.status(200).send(FullChat);
    }catch(err){

    }
})

const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId,chatName}=req.body;
    try{
        const updatedName=await Chat.findByIdAndUpdate({
            _id:chatId
        },{
            chatName:chatName
        },{
            new:true
        }).populate("users","-password").populate("groupAdmin")
         
        if(!updatedName){
            res.status(400);
            throw new Error("Chat not found");
        }
        res.status(200).send(updatedName);
    }catch(err){

    }
})

const addToGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;

    const addTo=await Chat.findByIdAndUpdate({
        _id:chatId,
    },{
        $push:{users:userId}
    },{
        new:true
    }).populate("users","-password").populate("groupAdmin");
    if(!addTo){
        res.send("User Not Found");
    }
    res.status(200).send(addTo);
})

const removeFromGroup=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;
    const removeTo=await Chat.findByIdAndUpdate({
        _id:chatId
    },{
        $pull:{users:userId}
    },{
        new:true
    }).populate("users","-password").populate("groupAdmin");

    if(!removeTo){
        res.send("User not found");
    }
    res.status(200).send(removeTo);
})

module.exports={accessChats,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup};