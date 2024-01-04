import React, { useContext, useState } from 'react'
import ChatProvider, { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/Chat/SideDrawer'
import MyChats from '../components/Chat/MyChats'
import ChatBox from '../components/Chat/ChatBox'


const ChatPage = () => {

  const {  user  } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>} 
    <Box style={{display:"flex", justifyContent:"space-between", width:"100%", height:"91.5vh",padding:"10px",gap:"0.5rem"}} >
      {user && <MyChats fetchAgain ={fetchAgain}  />}
      {user && <ChatBox fetchAgain ={fetchAgain} setFetchAgain={setFetchAgain} />}
    </Box>
    </div>
  )
}

export default ChatPage