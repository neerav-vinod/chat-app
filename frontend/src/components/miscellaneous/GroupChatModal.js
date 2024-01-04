import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import { UserListItem } from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

function GroupChatModal({children}) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const {user,chats,setChats} = ChatState();

  const handleSearch = async(query) => {
    setSearch(query);
    if(!query){
        return;
    }

    try{
        setLoading(true);
        const config ={
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        }

        const {data} = await axios.get(`http://localhost:8000/api/user?search=${search}`,config)
        setLoading(false);
        setSearchResult(data);
    }catch(e){
        toast({
            title: 'Error Occured',
            description: e.response.data,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'bottom-left'
          });
    }
  };

  const handleSubmit = async() => {

    if(!groupChatName || !selectedUsers){
        toast({
            title: "Please fill all the fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
    }
    try{
        const config = {
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        }

        const {data} = await axios.post(`http://localhost:8000/api/chat/group`,{
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u)=>u._id))
        },config)

        setChats([data,...chats])
        onClose();
        toast({
            title: "New Group Chat Created",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

    }catch(e){
        toast({
            title: "Failed to create Chat",
            status: "e.response.data",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
    }
  }

  const handleGroup =(userToAdd) =>{
    if(selectedUsers.includes(userToAdd)){
        toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
    
        setSelectedUsers([...selectedUsers, userToAdd]);  
    }

    const handleDelete = (delUser) =>{
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id))
    }
  

  return (
    <div>
       <span onClick={onOpen}>{children}</span>

<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Create Group Chat</ModalHeader>
    <ModalCloseButton />
    <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
      <FormControl>
        <Input
         placeholder='Chat Name'
         mb={3}
         onChange={(e)=>setGroupChatName(e.target.value)} />
      </FormControl>
      <FormControl>
        <Input
         placeholder='Add users '
         mb={1}
         onChange={(e)=>handleSearch(e.target.value)} />
      </FormControl>
      
      {selectedUsers.map((u)=>
        (<UserBadgeItem
        key={user._id}
        user={u}
        handleFunction={()=>handleDelete(u)}/>)
      )}

      <Box display='flex' flexDir={'column'} justifyContent={'center'} mt={2} w={'100%'} >
      {loading ? <div>loading</div>:(
        searchResult?.slice(0,4).map(user=>(
            <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)} />   
        ))
      )}
      </Box>
    </ModalBody>

    <ModalFooter>
      <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
        Create Group
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal> 
    </div>
  )
}

export default GroupChatModal