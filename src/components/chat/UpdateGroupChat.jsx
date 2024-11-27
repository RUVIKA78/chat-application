import { ViewIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  position,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { ChatState } from '../../context/chat.provider';
import UserBadgeItem from './UserBadgeItem';
import axios from 'axios';
import UserListItem from './UserListItem';

const UpdateGroupChat = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, setSelectedChat, selectedChat } = ChatState();

  const toast = useToast();

  useEffect(() => {
    if (selectedChat) {
      setGroupName(selectedChat.chatName);
    }
  }, [selectedChat]);

  const handleRemove =async (user1) => {
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: 'only admins can remove user',
        status: 'error',
        duration: '3000',
        isClosable: 'true',
        position:'bottom'
      })
      return

      
    }
    try {
      setLoading(true)
      const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.put("http://localhost:4000/api/chat/groupremove", {
        chatId: selectedChat._id,
        userId:user1._id
      },
        config
      )

      user1._id===user._id ? setSelectedChat():setSelectedChat(data)
      
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)

    }
    catch (error) {
      console.log(error);
      toast({
        title: 'error occured',
        description: error.message.data.message,
        status: "error",
        duration: '3000',
        isClosable: true,
        position:'bottom'
        
      })
      setLoading(false)
    }
  };

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
        return 
    }
    try {
        setLoading(true)
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        const { data } = await axios.get(`http://localhost:4000/api/user?search=${query}`, config)
        setLoading(false)
        setSearchResult(data)
    } catch (error) {
        toast({
            title: "Error occurred",
            description: "Failed to find user",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: 'bottom-left'
        })
    }
}


  const handleRename =async () => {
    if (!groupName) return
    
    try {
      setRenameLoading(true)
      const config = {
        headers: {
          Authorization:`Bearer ${user.token}`
        }
      }
      const { data } = await axios.put("http://localhost:4000/api/chat/rename",  {
        chatId:selectedChat._id,
        chatName: groupName
      },
      config)
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
    } catch (error) {
      console.log(error)
      toast({
        title: 'failed to update name',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
      setRenameLoading(false)
      setGroupName("")
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: 'user already in group',
        status: 'error',
        duration: '3000',
        isClosable: 'true',
        position:'bottom'
      })
      return
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'only admins can add user',
        status: 'error',
        duration: '3000',
        isClosable: 'true',
        position:'bottom'

      })
      return;
    }

    try {
      setLoading(true)
      const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.put("http://localhost:4000/api/chat/groupadd", {
        chatId: selectedChat._id,
        userId:user1._id
     }, config)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      console.log(error);
      toast({
        title: 'error occured',
        description: error.message.data.message,
        status: "error",
        duration: '3000',
        isClosable: true,
        position:'bottom'
        
      })
      setLoading(false)

    }
  }
  
  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat?.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.isAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display='flex'>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                variant="solid"  
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
              
            </FormControl>
            <FormControl display='flex'>
              <Input
                placeholder='add user '
                onChange={(e)=>handleSearch(e.target.value)}
                mb={1}
              />
               <Button
                variant="solid"  
                colorScheme="teal"
                ml={1}
                isLoading={loading}
                onClick={handleAddUser}
              >
                Add
              </Button>
            </FormControl>{
              loading ? (
              <Spinner size='lg'/>
              ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                    
                      key={user._id}
                      user={user}
                    handleFunction={()=>handleAddUser(user)}/>
                  ))
              )
            }
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={()=>handleRemove(user)}>
              Leave
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChat;
