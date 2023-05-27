import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  Input,
  FormControl,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "./UserListItem";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [groupName, setGroupName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSelect=async(query)=>{
     if(!query){
        return;
     }

     try{
        setLoading(true);
        setSearch(query);
        const config={
            headers:{
                Authorization:"Bearer "+user.token
            }
        }

        const {data}=await axios.get(`/api/user?search=${query}`,config);
         
        setLoading(false);
        setSearchResult(data);
     }catch(err){
       toast({
          title:'Failed to load the users',
          status:"error",
          position:"bottom-right",
          duration:5000
       })
     }
  }

  const handleSubmit=async ()=>{
     if(!groupName || !selectedUsers){
        toast({
            title:"Please fill all the details",
            status:"warning",
            position:"top",
            duration:5000
        })
        return;
     }

     try{

        const config={
            headers:{
                Authorization:"Bearer "+user.token
            }
        }

         const {data}=await axios.post("/api/chat/group",{
            name:groupName,
            users:JSON.stringify(selectedUsers.map((user)=>user._id))
         },config);
       
       

          chats.unshift(data);

          setChats(chats);

         onClose();
         toast({
            title:"Successfully Created the chat",
            status:"success",
            position:"top",
            duration:5000
         })

     }catch(err){
        toast({
            title:"Failed to create the chat",
            status:"error",
            position:"top",
            duration:5000
         })
     }

  }

  const handleGroup=(user)=>{
       if(selectedUsers.includes(user)){
         toast({
            title:"User already added",
            status:"error",
            position:"top",
            duration:5000
         });
         return;
       }

       setSelectedUsers([...selectedUsers,user]);

  }

  const handleDelete=(user)=>{
    
     setSelectedUsers(selectedUsers.filter((c)=>c._id!==user._id));
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Chat Group
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir={"column"} alignItems={"center"}>
          <FormControl>
            <Input
              placeholder="Enter the Group Name"
              mb={2}
              onChange={(e) => setGroupName(e.target.value)}
            />
            </FormControl>

            <FormControl>

            <Input
              placeholder="Select the users "
              mb={2}
              onChange={(e)=>{handleSelect(e.target.value)}}
            />
            </FormControl>
             <Box display="flex" flexWrap="wrap" w="100%">
            {selectedUsers.map((user)=><UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user)}/>)}
            </Box>
               
            {loading?loading:(
                searchResult?.slice(0,4).map((user)=><UserListItem key={user._id} user={user}  handleFunction={()=>handleGroup(user)}/>)
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
