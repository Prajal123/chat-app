import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <Box
    onClick={handleFunction}
      cursor={"pointer"}
      bg="#E8E8E8"
      _hover={{
        background:"#38b2ac",
        color:"white"
      }}
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      px={3}
      py={2}
      mb={2}
      borderRadius={"lg"}
    >

        <Avatar
        size="sm"
        mr={2}
        src={user.pic}
        alt={user.name}
        cursor={"pointer"}
        />

        <Box>
            <Text>{user.name}</Text>
            <Text fontSize="xs">
                <b>Email:</b>
                {user.email}
            </Text>
        </Box>

    </Box>
  )
}

export default UserListItem