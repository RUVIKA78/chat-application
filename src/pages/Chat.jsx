import React, {  useState } from 'react'
import { ChatState } from '../context/chat.provider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/chat/SideDrawer'
import MyChats from '../components/chat/MyChats'
import ChatBox from '../components/chat/ChatBox'

const Chat = () => {

  const user = ChatState()

  const [fetchAgain, setFetchAgain] = useState(false)
  
  return (
    <div style={{ width: "100%" }}>
      {
      user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent='space-between'
        h='91.5vh'
        w='100%'
        p='10px'
      >
        {user && <MyChats
          fetchAgain={fetchAgain}
          
        />}
        {user && <ChatBox
         fetchAgain={fetchAgain}
         setFetchAgain={setFetchAgain}
        />}
      </Box>
      
      </div>
  )
}

export default Chat