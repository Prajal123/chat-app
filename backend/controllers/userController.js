const User=require('../models/User');
const generateToken=require('../config/generateToken');
const asyncHandler=require('express-async-handler');

const registerUser=asyncHandler(async (req,res)=>{
    const {email,name,password,pic}=req.body;

    if(!email || !name || !password){
        throw new Error("Fill all the details");
        
    }

    const userExists=await User.findOne({email});

    if(userExists){
        throw new Error("User already exists");
    }

    const user=await User.create({
        name,
        email,
        password,
        pic
    });

    if(user){
        res.status(200).json({
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(401);
        throw new Error("Failed To create user");
    }
})


const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    const user=await User.findOne({email});
    if(user && user.matchPassword(password)){
      
        return res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic,
            token:generateToken(user._id) 
        })
        
    }else{

        throw new Error("User doesn't exist");
    }
})


const allUsers=asyncHandler(async(req,res)=>{
    const keyword=req.query.search?{
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
  
    }:{}

    const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
    
    res.send(users);
})

module.exports={registerUser,authUser,allUsers};