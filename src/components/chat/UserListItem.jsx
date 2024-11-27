import React from 'react'
import { ChatState } from '../../context/chat.provider'
import { Avatar, Box, Text } from '@chakra-ui/react'

const UserListItem = ({user, handleFunction }) => {
    // const { user } = ChatState();
  return (
      <div>
          <Box
              onClick={handleFunction}
              cursor='pointer'
              bg='#E8E8E8'
              _hover={{
                  background: '#38B2AC',
                  color:'white'
              }}
              w='100%'
              display='flex'
              alignItems='center'
              color='black'
              px={3}
              py={2}
              mb={2}
              borderRadius="lg"
          >
              
              <Avatar
                  mr={2}
                  size='sm'
                  cursor='pointer'
                  name={user.username}
                  src={user.profileImage}
                   
              />
              <Box>
              <Text  fontSize='xs'><b>Name : </b>{user.username}</Text>
                  <Text
                  fontSize='xs'><b>Email : </b>{user.email}</Text>
              </Box>
              
          </Box>
    </div>
  )
}

export default UserListItem