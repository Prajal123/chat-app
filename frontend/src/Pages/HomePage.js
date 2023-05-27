import React, { useEffect } from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import {useHistory} from 'react-router-dom';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import SignUp from '../components/Authentication/SignUp';
import Login from '../components/Authentication/Login';

const HomePage = () => {

  const history=useHistory();

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"));

    if(user){
      history.push("/chat");
    }

  },[history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        m="40px 0 15px 0"
        p={3}
        borderRadius="lg"
        borderWidth="1px"
        background={"white"}
        width="100%"
      >
        <Text textAlign={"center"} fontSize={"30px"}>
          Talk-A-Tive
        </Text>
      </Box>

      <Tabs variant="soft-rounded"  width="100%"  borderRadius="lg"
        borderWidth="1px"
        background={"white"}>
        <TabList m="10px 0 10px 0">
          <Tab width="50%">SignUP</Tab>
          <Tab width="50%">Login</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
             <SignUp />
          </TabPanel>
          <TabPanel>
             <Login />  
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Box></Box>
    </Container>
  );
};

export default HomePage;
