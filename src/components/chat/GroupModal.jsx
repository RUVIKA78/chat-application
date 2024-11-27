import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Input,
    Box,
    useToast,
    FormControl
} from '@chakra-ui/react'
import { ChatState } from '../../context/chat.provider'
import axios from 'axios'
import UserListItem from './UserListItem'
import UserBadgeItem from './UserBadgeItem'

const GroupModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [groupChatName, setGroupChatName] = useState("")
    const [selectedUser, setSelectedUser] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const { user, setChats, chats } = ChatState()
    
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
            const { data } = await axios.get(`http://localhost:4000/api/user?search=${search}`, config)
            
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

    const createChat = async () => {
        if (!groupChatName || selectedUser.length === 0) {
            toast({
                title: 'Please fill all the details',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top',
            })
            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const data = await axios.post("http://localhost:4000/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUser.map((u) => u._id))
            }, config)
            setChats([data, ...chats])
            onClose()
            toast({
                title: 'New group chat created',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
        } catch (error) {
            // console.log(error.response.data)
            toast({
                title: 'Failed to create group chat',
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }

    const handleDelete = (delUser) => {
        setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id))
    }

    const handleGroup = (userToAdd) => {
        if (selectedUser.includes(userToAdd)) {
            toast({
                title: 'User already added',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
            return
        }
        setSelectedUser([...selectedUser, userToAdd])
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        display='flex'
                        justifyContent='center'
                    >
                        Create A   Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                    >
                        <FormControl>
                            <Input
                                placeholder='Chat name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add users'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box
                            w="100%"
                            display='flex'
                            flexWrap='wrap'
                            mb={3}
                        >
                            {selectedUser.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            <div>Loading</div>
                        ) : (
                            searchResult?.slice(0, 4).map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={createChat}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupModal
