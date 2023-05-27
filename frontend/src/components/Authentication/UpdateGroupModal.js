import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider'; 
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';
import axios from 'axios';


const UpdateGroupModal = ({fetchAgain,setFetchAgain}) => {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [groupName, setGroupName] = useState();
    const [renameLoading,setRenameLoading]=useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const {user,selectedChat,setSelectedChat}=ChatState();
    const toast=useToast();

    const handleRemove=async(user1)=>{
         if(selectedChat.groupAdmin._id!==user._id && user1._id!==user._id){
            toast({
                title:"Some error",
                duration:5000,
                status:"error",
                position:"top"
            })
            return ;
         }
        
         setLoading(true);
         try{

            const config={
                headers:{
                    Authorization:"Bearer "+user.token
                }
            }

            const {data}=await axios.post("/api/chat/remove",{
               chatId:selectedChat._id,
               userId:user1._id
            },config);

            user._id===user1._id?setSelectedChat():setSelectedChat(data);

            setLoading(false);
            setFetchAgain(!fetchAgain);
            
         }catch(err){
            toast({
                title:"Some error",
                duration:5000,
                status:"error",
                position:"top"
            })
            setLoading(false);
         }
         
    }

    const addGroup=async(user1)=>{
       if(selectedChat.users.find((u)=>u._id===user1._id)){
        toast({
            title:'User already added',
            duration:5000,
            position:'top',
            status:'error'
        })
        return ;
       }

       if(selectedChat.groupAdmin._id!==user.id){
        toast({
            title:"You can't add user only admin can",
            duration:5000,
            position:'top',
            status:'error'
        })
        return ;
       }
       
       try{
           setLoading(true);

           const config={
              headers:{
                Authorization:"Bearer "+user.token
              }
           }

           const {data}=await axios.post("/api/chat/add",{
                 chatId:selectedChat._id,
                 userId:user1._id
           },config);

           setLoading(false);
           setSelectedChat(data);
           setFetchAgain(!fetchAgain);

       }catch(err){
          toast({
            title:err.message,
            duration:5000,
            position:'top',
            status:'error'
          })
       }

    }
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

    const handleRename=async()=>{
         if(!groupName){
            return;
         }

        setRenameLoading(true);
         try{

            const config={
                headers:{
                    Authorization:"Bearer "+user.token
                }
            }

            const {data}=await axios.post("/api/chat/rename",{
                chatId:selectedChat._id,
                chatName:groupName
            },config)

            setRenameLoading(false);
            setSelectedChat(data);
             setFetchAgain(!fetchAgain);
         }catch(err){
            toast({
                title:err.message,
                duration:5000,
                position:'top',
                status:'error'
              })
         }
    }
  
    return (
      <>
        <IconButton icon={<ViewIcon />} onClick={onOpen} />
  
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
            display={"flex"}
            fontFamily={"worksans"}
            justifyContent={"center"}
            fontSize={"3xl"}
            >
                {selectedChat.chatName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDir={"column"} alignItems={"center"}>
            

             
            <Box display="flex" flexWrap="wrap" w="100%">
            {selectedChat.users.map((user)=><UserBadgeItem key={user._id} user={user} handleFunction={()=>handleRemove(user)}/>)}
            </Box>


            <FormControl display="flex">
            <Input
              placeholder="Enter new Group Name"
              mb={2}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <Button variant="solid"
                colorScheme="teal"
                isLoading={renameLoading}
                ml={1}
                onClick={()=>{handleRename();}}
               >Update</Button>
            </FormControl>


            
            <FormControl>

            <Input
              placeholder="Select the users "
              mb={2}
              onChange={(e)=>{handleSelect(e.target.value)}}
            />
            </FormControl>
            
               
            {loading?loading:(
                searchResult?.slice(0,4).map((user)=><UserListItem key={user._id} user={user}  handleFunction={()=>addGroup(user)}/>)
            )}

            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='red'  onClick={()=>{handleRemove(user)}}>
                Leave Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default UpdateGroupModal