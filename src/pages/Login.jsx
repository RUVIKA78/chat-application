import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandle = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please fill all the details!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:4000/api/user/login',
        { email, password },
        config
      );

      
      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chat');
    } catch (error) {
      console.log('Error occurred during login', error);
      toast({
        title: 'Error Occurred, Try Again!',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  const loginHandle = () => {
    console.log('Forgot password clicked');
  };

  return (
    <div>
      <VStack spacing='5px'>
        <FormControl>
          <FormLabel>Email </FormLabel>
          <Input
            type='email'
            placeholder='Enter Your Email'
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password </FormLabel>
          <Input
            type='password'
            placeholder='Enter Your Password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          onClick={submitHandle}
          colorScheme='blue'
          width='100%'
          style={{ marginTop: 15 }}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          onClick={loginHandle}
          colorScheme='green'
          width='100%'
          style={{ marginTop: 15 }}
        >
          Forgot Password
        </Button>
      </VStack>
    </div>
  );
};

export default Login;
