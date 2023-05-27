import React, { useEffect, useState } from 'react'
import {Box, FormControl, IconButton, Input, Spinner, Text, useToast} from '@chakra-ui/react';
import {ChatState} from "../../Context/ChatProvider";
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSenderFull } from '../../config/ChatLogics';
import { getSender } from '../../config/ChatLogics';
import ProfileModel from './ProfileModel';
import UpdateGroupModal from './UpdateGroupModal';
import axios from 'axios';
import './styles.css';
import Scrollabel from './Scrollabel';
import io from "socket.io-client";
import Lottie from 'react-lottie';
import animationData from '../../animations/12966-typing-indicator.json';

const ENDPOINT="http://localhost:5000";
var socket,selectedChatCompare;

const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const ChatBox = ({fetchAgain,setFetchAgain}) => {

  const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState();
  const [loading,setLoading]=useState(false);
  const [messages,setMessages]=useState([]);
  const [newMessage,setNewMessage]=useState('');
 
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);
 
  const toast=useToast();
  const sendMessage=async(e)=>{
  
   if(e.key==="Enter" && newMessage){
        try{
          const config={
            headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+user.token
            }
          }
          setNewMessage("");
          const {data}=await axios.post("/api/message",{
                content:newMessage,
                chatId:selectedChat._id
          },config);

          socket.emit("new message",data);
           
           setMessages([...messages,data]);
        }catch(err){
           toast({
             title:'Error',
             status:'error',
             duration:5000,
             position:'bottom-right'

           })
        }
   }
  }
 
  const typingHandler=(e)=>{

      setNewMessage(e.target.value);

      if(!typing){
        setTyping(true);
        socket.emit("typing",selectedChat._id);
      }
      
      let lastMessageTime=new Date().getTime();
      var timer=3000;
      setTimeout(()=>{
         var time=new Date().getTime();
          var timeDiff=time-lastMessageTime;

          if(timeDiff>=timer && typing){
            socket.emit("stop typing",selectedChat._id);
            setTyping(false);
          }
      },timer)

  }


  const fetchMessages=async()=>{
   
    if(!selectedChat || !selectedChat._id)return ;
    try{
      setLoading(true);
      const config={
        headers:{
          "Authorization":"Bearer "+user.token
        }
      }
      const {data}=await axios.get(`/api/message/${selectedChat._id}`,config);

      setMessages(data);
      setLoading(false);
      
      socket.emit("join chat",selectedChat._id);

    }catch(err){
      toast({
        title:'Error',
        status:'error',
        duration:5000,
        position:'bottom-right'

      }) 
      setLoading(false);
    }
  }

  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit("setup",user);
   socket.on("connected",()=>{});
   socket.on("typing",()=>setIsTyping(true));
   socket.on("stop typing",()=>setIsTyping(false));
   },[])
 

  useEffect(()=>{
     fetchMessages();
     selectedChatCompare=selectedChat;
  },[selectedChat]);

  useEffect(()=>{
    socket.on("message received",(newMessageReceived)=>{
  
      if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id){
        if(!notification.includes(newMessageReceived)){
        setNotification([...notification,newMessageReceived]);
        setFetchAgain(!fetchAgain);
        
        }
     
      }else{
        setMessages([...messages,newMessageReceived]);
      }
    })
  })



  return (
   <Box
   display={{base:selectedChat?"flex":"none",md:"flex"}}
   bg="white"
   alignItems="center"
   flexDir="column"
   h="100%"
   p={3}
   borderRadius="lg"
   borderWidth="1px"
   w={{base:"100%",md:"68%"}}
   >
   
   {selectedChat._id?(

    <>
    
      <Text
      fontSize={{base:"28px",md:"30px"}}
      fontFamily={"Work sans"}
      pb={3}
      px={2}
      w="100%"
      display={"flex"}
      justifyContent={{base:"space-between"}}
      alignItems={"center"}
      >
       <IconButton display={{base:"flex",md:"none"}} 
       icon={<ArrowBackIcon />}
       onClick={()=>{setSelectedChat("")}}
       />

       {selectedChat.isGroupChat?(
        <>
        {selectedChat.chatName.toUpperCase()} 
         <UpdateGroupModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </>
       ):(
        <>
          {getSender(user,selectedChat.users)}
          <ProfileModel user={getSenderFull(user,selectedChat.users)}/>
          </>
       )}

      </Text>

    <Box
     display={"flex"}
     justifyContent={"flex-end"}
     flexDir={"column"}
     borderRadius={"lg"}
     p={3}
     bg="#e8e8e8"
     width={"100%"}
     height={"100%"}
     overflowY="hidden"
    >

{loading?<Spinner 
      alignSelf={"center"}
      margin={"auto"}
      height={"100px"}
      width={"100px"}
      />:(<div className='messages'>
        <Scrollabel messages={messages} />
      </div>)}

     <FormControl onKeyDown={sendMessage}>
      {isTyping?<div><Lottie 
      width={70}
      options={defaultOptions}
      style={{
        marginBottom:15,marginLeft:0,
      }}
      /></div>:<></>}
      <Input onChange={typingHandler} 
       variant={"filled"}
       placeholder='Enter new Message'
       mt={3}
       value={newMessage}
      />
     </FormControl>
   
    </Box>
      
      </>
  
   ):(
    <Box 
    h="100%"
    display={"flex"}
    justifyContent={"center"}
    alignItems={"center"}
    >
      <Text 
      fontSize="3xl"
      pb={3}
      fontFamily="Work sans"
       >
      Click on a user to start chatting
      </Text>

      </Box>

   )}
   </Box>
  )
}

export default ChatBox