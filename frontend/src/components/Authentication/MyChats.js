import React, { useEffect,useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({fetchAgain}) => { 
  const { chats, setChats, user, setSelectedChat, selectedChat } = ChatState();
  const [loggedUser,setLoggedUser]=useState();
  const toast = useToast();


  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      };
      const { data } = await axios.get("/api/chat", config);
    console.log(data);
      setChats(data);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        duration: 5000,
        status: "error",
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchChats();
    const userInfo=JSON.parse(localStorage.getItem("userInfo"))
  
    setLoggedUser(userInfo);
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "31%" }}
      bg="white"
      flexDir="column"
      p={3}
      h="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
       display="flex"
       justifyContent="space-between"
       pb={3}
       px={2}
       w="100%"
       fontSize={{base:"28px", md:"30px"}}
       fontFamily="Work sans"
      >
        My Chats
       
       <GroupChatModal>
      <Button fontSize={{base:"17px",md:"10px",lg:"17px"}} rightIcon={ <AddIcon />} >New Group Chat</Button>
      </GroupChatModal>
      </Box>

      <Box
       display="flex"
       flexDir={"column"}
       width={"100%"}
       height={"100%"}
       p={3}
       bg="#f8f8f8"
       borderRadius={"lg"}
       overflowY={"hidden"}
      >

        {chats ?(
          <Stack overflowY="scroll">
            {chats.map((chat)=>(
              <Box
              display={"flex"}
              width={"100%"}
              onClick={()=>{setSelectedChat(chat);}}
              cursor={"pointer"}  
              bg={selectedChat===chat?"#38b2ac":"#e8e8e8"}
              color={selectedChat===chat?"white":"black"}
              px={2}
              py={2}
              borderRadius={"lg"}
              key={chat._id}
              >
                <Text>
                {!chat.isGroupChat?
                    getSender(loggedUser,chat.users)
                :chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ):(
          <ChatLoading />
        )}

      </Box>
    </Box>
  );
};

export default MyChats;
