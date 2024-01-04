import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Image, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text,  Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from '../miscellaneous/ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import { UserListItem } from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {user,setSelectedChat, chats , setChats,notification,setNotification,selectedChat} = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure ()

  const toast = useToast();

  const history = useNavigate();

  const logoutHandler = ()=>{
    localStorage.removeItem("userInfo");
    history('/')
  }

  const handleSearch = async() =>{
    if(!search){
      toast({
        title: 'please enter a search term',
        // description: "We've created your account for you.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      });
      return;
    }

    try{
      setLoading(true)

      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }

      const response = await axios.get(`http://localhost:8000/api/user?search=${search}`,config)
      setLoading(false);
      setSearchResult(response.data);
    }catch(err){
      toast({
        title: 'Error Occured',
        description: "Failed to Load the Search Results",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      });
    }

  }

  console.log("____Selected Chat",selectedChat)

  const accessChat = async (userId) =>{
    try{
      setLoadingChat(true);
      const config = {
        headers:{
          "Content-Type": "application/json",
          Authorization:`Bearer ${user.token}`
        }
      }

      const {data} = await axios.post('http://localhost:8000/api/chat',{userId},config);

      if(!chats.find((c)=>c._id === data._id)) setChats([data,...chats])

      setSelectedChat(data)
      setLoadingChat(false);
      onClose(); 
    }catch(error){
      toast({
        title: 'Error Fetching chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      });
    }
  }

  const notificationSetting=()=>{
    alert('clicked')
  } 
  return (
    <div>
      <Box
      style={{display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      backgroundColor:"white",
      width:"100%",
      padding:"5px 10px 5px 10px",
      borderWidth:"5px"}}>
        <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen}>
            <Text display={{base:"none",md:"flex"}} px='4'>
              Search User
            </Text>
          <SearchIcon/>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" display={"flex"} color={"#C148E9"} fontWeight={'bold'} >
           <Image src="https://i.postimg.cc/W3Wk3W2F/9171503.png" h={9} /> Byte <Text color={'#810DA8'} ml={1}>Talk</Text>
          </Text>

        <div>
          <Menu>
            <MenuButton p={1} >
              <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1}/>
              <MenuList pl={2}>
                {!notification.length && "No New Messages"}
                {notification.map((notif)=>(
                  
                   < MenuItem onClick={()=>notificationSetting} >
                    {notif.chat.isGroupChat ? `New Message: ${notif.chat.chatName}` : `New Message from ${getSender(user,notif.chat.users)}`}
                  </MenuItem>
                  
                ))}
                
              </MenuList>
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} >
              <Avatar size="sm" cursor={'pointer'} name={user.name} src={user.pic}  />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' isOpen={isOpen} onClose={onClose} >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
            <DrawerBody>
            <Box display='flex' pb={2} >
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={e=> setSearch(e.target.value)}
              />
              <Button 
              onClick={handleSearch}
              >Go</Button>
            </Box>
            {loading ? 
            (<ChatLoading/>):
            (
              searchResult?.map(user=>(
                <UserListItem
                 user={user._id}
                 user={user}
                 key={user._id}
                 handleFunction={()=>accessChat(user._id)}
                />
              ))
            )
          }
            {loadingChat && <Spinner ml='auto' display="flex"/>}
          </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </div>
  )
}

export default SideDrawer