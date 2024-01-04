import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { Avatar, Box, Button, Stack, Text, Tooltip, useToast } from '@chakra-ui/react';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/ChatLogics';
import GroupChatModal from '../miscellaneous/GroupChatModal';
import { MdOutlineGroupAdd } from "react-icons/md";


const MyChats = ({fetchAgain}) => {

  const { selectedChat , setSelectedChat, user , chats , setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const [loading,setLoading] = useState(false);

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const  response  = await axios.get("http://localhost:8000/api/chat", config);
      console.log(response.data);
      setChats(response.data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(error);
    }
  };

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[fetchAgain])

  console.log(chats,"This is Chats");

  return (
    <div>
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir={'column'}
      alignItems={'center'}
      p={3}
      bg={'white'}
      w={{base: '97vw', md: '30vw'}}
      h={'90vh'}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '1.5em', md: '30px' }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent={'space-between'}
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Tooltip
          hasArrow
          label="New Group Chat"
          bg={'gray.300'}
          color={'black'}
          >
        <Button
            display={"flex"}
            fontSize={ "17px" }
          >
            
           <MdOutlineGroupAdd/>
          </Button>
          </Tooltip>
        </GroupChatModal>
      </Box>

      {loading === false ? <Box display={'flex'}
          flexDir={"column"}
          bg={"#F8F8F8"}
          w={'100%'}
          h={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}
          >
            {chats ? 
              <Stack overflow={'scroll'} >
                {chats.map((chat)=>(
                  <Box 
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#810DA8" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}>
              
                  <Text>
                    {!chat.isGroupChat ? getSender(loggedUser,chat.users):
                    chat.chatName}
                  </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                  )}
                  </Box>
                ))}
              </Stack>
             : <ChatLoading/>}
          </Box>:<ChatLoading/>}

    </Box>
  </div>
  )
}

export default MyChats