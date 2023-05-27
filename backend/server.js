const express= require('express');
const dotenv=require('dotenv');
// const {notFound,errorHandler}=require('./middlewares/errorMiddleware');

const userRouter=require('./routers/userRouter');
const chatRouter=require('./routers/chatRouter');
const messageRouter=require('./routers/messageRouter');
const path=require('path');

const chats=require('./data/data');
const connectDb = require('./config/db');

dotenv.config();

connectDb();

const app=express();
    
const __dirname1=path.resolve();
if(process.env.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname1,"/frontend/build")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    })
}else{

    app.get("/",(req,res)=>{
        res.send("API is running successfully");
    })
}

// app.use(notFound);
// app.use(errorHandler);
app.use(express.json());
app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);

const server=app.listen(process.env.PORT,()=>{
   
    console.log("Server is listening at 5000");
})

const io=require('socket.io')(server,{
    pingTimeOut:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
       
        socket.emit("connected");
    })

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User joined room:" + room);
    })
    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));
    socket.on("new message",(newMessageReceived)=>{
        var chat=newMessageReceived.chat;
        if(!chat.users)return console.log("chat.users not defined");

        chat.users.forEach((user)=>{
            if(user._id == newMessageReceived.sender._id)return ;
            socket.in(user._id).emit("message received",newMessageReceived);
        })
    })

    socket.off("setup",()=>{
        console.log("User disconnected");
        socket.leave(userData._id);
    })
})