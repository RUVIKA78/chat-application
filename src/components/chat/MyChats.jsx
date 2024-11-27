import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/chat.provider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/chatLogics';
import GroupModal from './GroupModal';

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  
  const [loggedUser, setLoggedUser] = useState();
  
  const toast = useToast();

  const fetchChats = async () => {
     
    try {
     
      // console.log('user or  token not available', user);
      if (!user || !user.token) {
        toast({
          title: 'Authorization error',
          description: 'User token is missing',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      const { data } = await axios.get('http://localhost:4000/api/chat', config);
      setChats(data);
    }
    catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: 'Error in fetching the chats',
        description: 'error in fetching chats',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };
  
      
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
   
    fetchChats();
  }, [fetchAgain]);

  return (
    <div>
      <Box
        display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
        flexDir='column'
        alignItems='center'
        p={3}
        bg='white'
        h='100%'
        m={1}
        w={{ base: '100%', md: '31%', lg: '100%' }}
        borderRadius='lg'
        borderWidth='1px'
      >
        <Box
          py='3'
          px='3'
          fontSize={{ base: '28px', md: '30px' }}
          display='flex'
          w='100%'
          alignItems='center'
          justifyContent='space-between'
        >
          My Chats
          <GroupModal>
            <Button
              display='flex'
              p={3}
              fontSize={{ base: '17px', md: '10px', lg: '17px' }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupModal>
        </Box>
        <Box
          display='flex'
          flexDir='column'
          p={3}
          bg='#F8F8F8'
          w='100%'
          borderRadius='lg'
          overflowY='hidden'
          h='100%'
        >
          {chats ? (
            <Stack overflowY='scroll'>
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor='pointer'
                  bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                  color={selectedChat === chat ? '#fff' : '#000'}
                  px={4}
                  py={4}
                  borderRadius='lg'
                  key={chat._id}
                >
                  <Text>
  {!chat.isGroupChat
      ? getSender(loggedUser, chat.users)
     
    : chat.chatName}
</Text>

                  {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.username} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </div>
  );
};

export default MyChats;
