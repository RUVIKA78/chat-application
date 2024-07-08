import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/chat.provider';
import { Box, FormControl, IconButton, Input, Spinner, Text, Toast, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../config/chatLogics';
import ProfileModal from '../ProfileModal';
import UpdateGroupChat from './UpdateGroupChat';
import axios from 'axios';
import './styles.css'
import ScrollableChat from './ScrollableChat';
import { io } from 'socket.io-client';
import Lottie from 'react-lottie'
import animationData from "../../animations/typing.json"


const ENDPOINT = "http://localhost:4000"
var socket, selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([])
  const [loading, setloading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const toast = useToast()

  const { user, selectedChat, setSelectedChat , notification, setNotification} = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData:animationData,
    rendererSettings: {
      preserveAspectRatio:'xMidYMid slice'
    }
  }


  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on('connection', () => {
      setSocketConnected(true)
    })
      
      socket.on('typing', () => setIsTyping(true))
      socket.on('stop typing', () => setIsTyping(false))
    
  }, [])

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {

      socket.emit('stop typing', selectedChat._id)

      try {
        const config = {
          headers: {
            "Content-Type": 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }
        setNewMessage("");
        
        const { data } = await axios.post("http://localhost:4000/api/message", {
          content: newMessage,
          chatId: selectedChat._id
        }, config)

        socket.emit('new message', data)
        
        setMessages([...messages, data]);


      } catch (error) {
        toast({
          title: 'Error occurred',
          description: error.response?.data?.message || error.message,
          status: 'warning',
          duration: 3000,
          position: 'bottom'
        })
      }
    }
  }


  const fetchMessages = async () => {
    if (!selectedChat) return

    try {
      const config = {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      }
      setloading(true)

      const { data } = await axios.get(`http://localhost:4000/api/message/${selectedChat._id}`, config)

      // console.log(messages);
      setMessages(data)
      setloading(false)

      socket.emit('join chat', selectedChat._id)

    }
    catch (error) {
      toast({
        title: 'Error occurred',
        description: 'Failed to load messages',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "bottom"
      })
    }
  }



  useEffect(() => {

    fetchMessages();
    selectedChatCompare = selectedChat

  }, [selectedChat]);

// console.log(notification);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {

        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification])
          setFetchAgain(!fetchAgain)
}

      }
      else {
        setMessages(...messages, newMessageReceived)
      }
    })
  }, [])


  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!socketConnected) return
    
    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id)
    }

    let lastTypingTime = new Date().getTime()
    var timelength = 3000
    
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime
     
      if (timeDiff >= timelength && typing) {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      }
    },timelength)
  }


  return (
    <>
      {selectedChat ? (
        <>
          <Text
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            w="100%"
            pb={3}
            px={2}
            fontSize={{ base: "28px", md: '30px' }}
          >
            <IconButton
              display="flex"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChat
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >

            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              
              onKeyDown={sendMessage}
              isRequired mt={3}
            >
              {isTyping ?
                <div>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{marginBottom: 15, marginLeft:0}}
                />
              </div> : <div></div>}
              <Input
                value={newMessage}
                placeholder='type a message here'
                onChange={typingHandler}
                variant='filled'
                bg='#E0E0E0'

              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
