import { Tooltip ,Button,Box,Text, Menu, MenuButton, Avatar, MenuList, MenuItem, Input, useToast, Spinner} from "@chakra-ui/react";
import React, { useState } from "react";
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import NotificationBadge, { Effect } from 'react-notification-badge';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure
  } from '@chakra-ui/react';
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [loading, setLoading] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure()

  const {user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();

  const history=useHistory();

  const logoutHandler=()=>{
      localStorage.removeItem("userInfo");
      history.push("/");
  }

 const toast=useToast();



  const handleSearch=async()=>{
    setLoading(true);

     if(!search){
       toast({
         title:"Please type something",
         status:"warning",
         duration:"5000",
         position:"top-left"
       })
       return;
     }

     try{
      
        const config={
            headers:{
                Authorization:"Bearer "+user.token
            }
        }

        const {data}=await axios.get(`/api/user?search=${search}`,config);

        setLoading(false);
        setSearchResult(data);
    
     }catch(err){
    
        toast({
            title:"Error founding in Users",
            status:"error",
            duration:"5000",
            position:"top-left"
          })
          return;
        }
     }

     const accessChat=async (userId)=>{
        setLoadingChat(true);
         try{
           const config={
              headers:{
                Authorization:"Bearer "+user.token,
                "Content-type":"application/json"
              }

           }
           const {data}=await axios.post("/api/chat",{userId},config);

           if(!chats.find((c)=>c._id===data._id))setChats([data,...chats]);

           setLoadingChat(false);
           setSelectedChat(data);

         }catch(err){
            toast({
                title:"Error",
                description:err.message,
                duration:5000,
                status:'error',
                position:'bottom'
              })
         }
     }
  
  return (
    <>
      <Box 
      display="flex"
      justifyContent='space-between'
      alignItems='center'
      bg="white"
      width="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
      >

        <Tooltip label="Search results for Users" hasArrow placement="bottom">
        <Button variant="ghost" onClick={onOpen}>
            <i class='fas fa-search'></i>
            <Text d={{base:'none',md:'flex'}} p="4">Search User</Text>
        </Button>

        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work-Sans">Talk A Tive</Text>

        <div>
            <Menu>
                <MenuButton p={1}>
                  <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                  />
                    <BellIcon fontSize="2xl" m={1}></BellIcon>
                </MenuButton>

                <MenuList pl={2}>
                 {!notification.length && <MenuItem>No new Messages</MenuItem>}
                 {notification && notification.map((notif)=>(
                  <MenuItem key={notif._id} onClick={()=>{setSelectedChat(notif.chat);
                    setNotification(notification.filter((n)=>n!==notif));
                  }

                  }>
                    {notif.chat.isGroupChat?`New Message from ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
                  </MenuItem>
                 ))}
                </MenuList>
                </Menu>
                <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Avatar cursor={"pointer"} name={user.name} src={user.pic} size="sm" ></Avatar>
                </MenuButton>

                <MenuList>
                    <ProfileModel user={user}>
                    <MenuItem>My Profile</MenuItem>
                    </ProfileModel>
                    <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
                </MenuList>
            </Menu>
        </div>

      </Box>



      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>

          <DrawerBody>
            <Box
             display={"flex"}
             pb={2}
            >
        <Input 
         placeholder="search users"
         value={search}
         mr={2}
         onChange={(e)=>setSearch(e.target.value)}
        />
        <Button
             onClick={handleSearch}
             >Go</Button>
        </Box>

        {loading?<ChatLoading />:(
            searchResult?.map((user)=>{
                return <UserListItem
                 key={user._id}
                 user={user}
                 handleFunction={()=>accessChat(user._id)}
                >

                </UserListItem>
            })
        )}
        {loadingChat && <Spinner  ml="auto" display={"flex"}/>}
          </DrawerBody>
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
 

    </>
  );
};

export default SideDrawer;
