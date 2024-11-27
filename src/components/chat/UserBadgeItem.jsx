import { Badge, CloseButton } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handlefunction,admin}) => {
    
    return (
      <Badge
          px={2}
          py={2}
          borderRadius='lg'
          m={1}
          mb={2}
          variant="solid"
          colorScheme='purple'
          cursor='pointer'
        onClick={handlefunction}
        backgroundColor='purple'
        color='white'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        {user.username}
        {admin===user._id && <span>(Admin)</span>}
          <CloseButton/>
          
    </Badge>
  )
}

export default UserBadgeItem