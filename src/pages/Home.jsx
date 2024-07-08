import React, { useEffect } from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import "../App.css"
import Login from './Login'
import Signup from './Signup'
import { useNavigate } from 'react-router-dom'


const Home = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const user=JSON.parse(localStorage.getItem("userInfo"))
      
    if (user) {

      navigate('/chat')

      }
  }, [navigate])

  return (
    <Container maxW='xl' centerContent >
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg='white'
        w="100%"
        m="40px 0 15px 0"
        borderRadius='1px'
        borderWidth='1px'
      >
        <Text
          fontSize="4xl"
        >Chat App</Text></Box>

      <Box

        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant='soft-rounded' colorScheme='blue'>
          <TabList
            mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{<Login />}</TabPanel>
            <TabPanel>{<Signup />}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home