import { Avatar, Box, Button, Input, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider
} from '@chakra-ui/react';
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton
} from '@chakra-ui/react';
import { ChatState } from '../../context/chat.provider';
import ProfileModal from '../ProfileModal';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { getSender } from '../../config/chatLogics';
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const toast = useToast();

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    const navigate = useNavigate()

    const logoutHandle = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Enter user',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-left',
            });
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`http://localhost:4000/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            console.log(error);
            toast({
                title: 'Error occurred',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left',
            });
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post('http://localhost:4000/api/chat', { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: 'Error in fetching the chat',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left',
            });
        }
    };

    return (
        <div>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                bg="white"
                w="100%"
                borderWidth='5px'
                p="5px 10px 5px 10px">
                <Tooltip
                    label="search users here"
                    hasArrow
                    placement='bottom-end'
                >
                    <Button variant='ghost' onClick={onOpen} ref={btnRef}>
                        <i className="fa fa-search" aria-hidden="true"></i>
                        <Text display={{ base: 'none', md: 'flex' }} px='3'> Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize='2xl'>Chat App</Text>
                <div>
                    <Menu>

                        <MenuButton>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notify) => (
                                <MenuItem key={notify.id} onClick={() => {
                                    setSelectedChat(notify.chat)
                                    setNotification(notification.filter((n) => n !== notify))
                                }}>{notification.chat.isGroupChat ? `New Message ${notify.chat.chatName}` : `New Message from ${getSender(user, notification.chat.users)}`}</MenuItem>
                            ))
                            }
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor='pointer' />
                        </MenuButton>

                        <MenuList>
                            <ProfileModal>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandle}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Search User</DrawerHeader>

                    <DrawerBody>
                        <Box display='flex' pb={2}>
                            <Input
                                placeholder='search by name or email'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button colorScheme='blue' onClick={handleSearch}>Go</Button>
                        </Box>

                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml='auto' display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default SideDrawer;
