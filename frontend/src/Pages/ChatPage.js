import React from "react";
import { useState } from 'react';
import {ChatState} from '../Context/ChatProvider';
import {Box} from '@chakra-ui/react';
import ChatBox from '../components/Authentication/ChatBox';
import MyChats from '../components/Authentication/MyChats';
import SideDrawer from '../components/Authentication/SideDrawer';


const ChatPage = () => {
  const {user}=ChatState();
  const [fetchAgain,setFetchAgain]=useState();
  

  return (
   <div style={{width:'100%'}}>
   
      {user && <SideDrawer />}
  
     <Box justifyContent='space-between' w='100%' h='91.5vh' p='10px' display={"flex"}>
     
       {user && <MyChats fetchAgain={fetchAgain}/>}
       {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />}
     </Box>
       
    </div>
  )
}

export default ChatPage;


