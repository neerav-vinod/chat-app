import {
    Box,
    Container,
    Image,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
  } from "@chakra-ui/react";
  import { useEffect } from "react";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Login from "../components/Login";
  import Signup from "../components/Signup";
  
  
  function Homepage() {
    const history = useNavigate();
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
  
      if (user) history("/chats");
    }, [history]);
  
    return (
      <Container maxW="xl" display={"flex"} flexDir={'column'} alignItems={'center'} h={'100vh'} justifyContent={'center'}>
        <Box
          display="flex"
          justifyContent="center"
          p={3}
          bg="white"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize="4xl" display={"flex"} color={"#C148E9"} fontWeight={'bold'} >
           <Image src="https://i.postimg.cc/W3Wk3W2F/9171503.png" h={12} /> Byte <Text color={'#810DA8'} ml={1}>Talk</Text>
          </Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
          <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    );
  }
  
  export default Homepage;