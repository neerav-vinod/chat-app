import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {  getSender, getSenderFull } from '../../config/ChatLogics';
import ProfileModal from '../miscellaneous/ProfileModal';
import UpdateGroupChatModel from '../miscellaneous/UpdateGroupChatModel';
import axios from 'axios';
import '../style.css';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import Lottie from 'lottie-react'
import animationData from '../../animations/typing.json'
import { IoMdSend } from "react-icons/io";




const ENDPOINT = 'http://localhost:8000'
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const{user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();

    const [messages, setMessages] =useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage,setNewmessage] = useState()
    const [socketConnected,setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false)



    const toast = useToast();

    const fetchMessages = async () =>{
      if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:8000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id)

    } catch (error) {
    toast({
      title: "Error Occured!",
      description: "Failed to Load the Messages",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }
};

useEffect(()=>{
  socket = io(ENDPOINT);
  socket.emit('setup', user)
  socket.on("connection",()=>{
    setSocketConnected(true)
  })

  socket.on('typing', () => setIsTyping(true))
  socket.on('stop typing', () => setIsTyping(false))

},[])

    useEffect(()=>{
      fetchMessages();
      selectedChatCompare = selectedChat
    },[ selectedChat]);

   

    useEffect(()=>{
      socket.on('message recieved',(newMessageRecieved)=>{
        if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
          if(!notification.includes(newMessageRecieved)){
            setNotification([newMessageRecieved,...notification]);
            setFetchAgain(!fetchAgain);
          }
        }else{
          setMessages([...messages,newMessageRecieved])
        }
      })
    })

    const sendMessage = async(event) =>{
      // if(event.key === "Enter" && newMessage){
        socket.emit('stop typing', selectedChat._id)
        try {
          const config = {
            headers:{
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`,
            }
          }

          const {data} = await axios.post('http://localhost:8000/api/message',{
            content: newMessage,
            chatId: selectedChat._id,
          },config);

          
          socket.emit('new message',data)
          setMessages([...messages, data])

          setNewmessage('')
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      // }
    }

  

    const typingHandler = (e) =>{
      setNewmessage(e.target.value)

      if(!socketConnected) return;

      if(!typing){
        setTyping(true);
        socket.emit('typing',selectedChat._id)
      }

      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;

      setTimeout(()=>{
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;

        if(timeDiff >= timerLength && typing){
          socket.emit('stop typing', selectedChat._id)
          setTyping(false);
        }
      }, timerLength);
    }

  return (
    <>
    {
      selectedChat ? 
      <>
      <Text fontSize={{base:"28px", md:"30px"}}
       pb={3}
       px={2}
       w={"100%"}
       display={'flex'}
       justifyContent={{base:"space-between"}} 
       alignItems={'center'}
      >
        <IconButton
        display={{base:"flex",md:"none"}}
        icon={<ArrowBackIcon/>}
        onClick={()=>setSelectedChat('')}
        />
        {!selectedChat?.isGroupChat ? 
        <>
        {getSender(user,selectedChat.users)}
        <ProfileModal user={getSenderFull(user,selectedChat.users)} />
        </>
        :
        <>
        {selectedChat.chatName.toUpperCase()}
        <UpdateGroupChatModel
        fetchMessages={fetchMessages}
        fetchaAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        />
        </>  
        }
      </Text>
      <Box display={'flex'}
           flexDir={"column"}
           justifyContent={'flex-end'}
           p={3}
           w={'100%'}
           h={'100%'}
           borderRadius={'lg'}
           overflowY={'hidden'}
           style={{backgroundImage:"url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.redd.it%2Fqwd83nc4xxf41.jpg&f=1&nofb=1&ipt=c65fc46c07c209dbec355b9b013198178b2b309bbf2683bd32fed8e440c96ff0&ipo=images')"}}
      >
          {loading ? 
          <Spinner
           size="xl"
           w={20}
           h={20}
           alignSelf={'center'}
           margin={'auto'}
          />: <div className='messages'>
            <ScrollableChat messages={messages}/>
            </div>}
            <Box display={'flex'}  justifyContent={'center'} alignItems={'center'} gap={2}>
          <FormControl onKeyUp={(e)=> e.key === 'Enter' && sendMessage()} isRequired mt={3} >
            {isTyping ? 
           <Box height={12} width={12} ><Lottie
            animationData={animationData}
            /></Box>: "" }
            <Input
            variant={'filled'}
            bg="#E0E0E0"
            placeholder='Enter a message..'
            onChange={typingHandler}
            value={newMessage}
            />
          </FormControl>
          <Button mt={3} rounded={'full'} bg='#C148E9' onClick={sendMessage} ><IoMdSend color='white'/></Button>
          </Box>  
      </Box>
      </> 
      :
      <Box display="flex" alignItems={'center'} justifyContent={"center"} h={"100%"}>
        <Text fontSize={"3xl"} pb={3} >
          Click on a user to start chatting
        </Text>
      </Box>
    }
    </>
  )
}

export default SingleChat