import { Box, CloseButton, Text } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handlefunction}) => {
    
    return (
      <Box
          px={2}
          py={2}
          borderRadius='lg'
          m={1}
          mb={2}
          variant="solid"
          colorScheme='putple'
          cursor='pointer'
        onClick={handlefunction}
        backgroundColor='purple'
        color='white'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        {user.username}
          <CloseButton/>
          
    </Box>
  )
}

export default UserBadgeItem