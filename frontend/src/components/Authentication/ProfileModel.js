import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Image } from '@chakra-ui/react';
import React from 'react'
import { useDisclosure,Button,Text } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'

const ProfileModel = ({user,children}) => {
  
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
    {children?(
         <span onClick={onOpen} >{children} </span>
    ):(<IconButton icon={<ViewIcon />} onClick={onOpen}>

    </IconButton>)}
    
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} justifyContent={"space-between"}  alignItems={"center"} flexDirection={"column"}>
           <Image 
           src={user.pic} alt={user.name} borderRadius={"full"} boxSize={"150px"}>
           </Image>
           <Text fontSize={{base:"28px",md:"30px"}} fontFamily="Work Sans">Email:{user.email}</Text>
          </ModalBody>
 
          <ModalFooter>
           
            <Button variant='ghost'>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default ProfileModel