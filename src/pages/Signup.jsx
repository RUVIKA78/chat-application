import { Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Signup = () => {

    
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [profile, setProfile] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const postDetails = (profiles) => {
        setLoading(true)
        if (profiles === undefined) {
            toast({
                title: 'Upload Profile Picture!',
                description: "",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return
        }

        if (profiles.type === "image/jpg" || profiles.type === "image/jpeg" || profiles.type === "image/png") {
            const data = new FormData()
            data.append("file", profiles)
            data.append("upload_preset", "chat-app")
            data.append("cloud_name", "dyhrqxinl")
            fetch("https://api.cloudinary.com/v1_1/dyhrqxinl/image/upload", {
                method: 'POST',
                body: data,
            }).then((res) => res.json())
                .then((data) => {
                    setProfile(data.url)
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err);
                    toast({
                        title: 'Error uploading image!',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                        position: "bottom"
                    })
                    setLoading(false)
                })
        } else {
            toast({
                title: 'Select a valid Profile Picture!',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
    }

    const submitHandle = async (req,res) => {
        setLoading(true)
        if (!name || !email || !password || !confirm || !profile) {
            toast({
                title: 'Please fill all the details!',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return
        }
        if (password !== confirm) {
            toast({
                title: `Characters didn't match!`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
            // setLoading(false)

            return
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            }

            const userData = { username: name, email, password, profileImage: profile };
        // console.log('Sending user data:', userData); 

        const { data } = await axios.post(
            "http://localhost:4000/api/user",
            userData,
            config
        );
            
            console.log('Response data:', data)
            
            toast({
                title: 'Registration Successful',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })

            localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false)
            navigate('/chat')
        } catch (error) {
            
            // console.log("error occured during registration", error);
            toast({
                title: 'Error Occured, Try Again!',
                description: error.response.data.message,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)

        } 
    }

    return (
        <div>
            <VStack spacing='5px'>
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                        type='text'
                        name='username'
                        placeholder='Enter Your Name'
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type='email'
                        name='email'
                        placeholder='Enter Your Email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type='password'
                        name='password'
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                        type='password'
                        name='confirmPassword'
                        placeholder='Confirm Your Password'
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Profile Image</FormLabel>
                    <Input
                        type='file'
                        name='profileImage'
                        accept='image/*'
                        onChange={(e) => postDetails(e.target.files[0])}
                    />
                </FormControl>
                <Button
                    onClick={submitHandle}
                    colorScheme='blue'
                    width="100%"
                    style={{ marginTop: 15 }}
                    isLoading={loading}
                >
                    Sign Up
                </Button>
            </VStack>
        </div>
    )
}

export default Signup
