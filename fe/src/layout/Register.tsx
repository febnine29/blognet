import React from 'react';
import { Box, useToast } from '@chakra-ui/react';
import RegisterForm from '../component/RegisterForm';
import axios from 'axios';
import { useNavigate } from 'react-router';
 export default function Register(){
    
    const navigate = useNavigate()
    const toast = useToast()
    const handleRegister = async(username: string, password: string, name: string, email: string) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
                username,
                password,
                name,
                email
            });
            // const data: LoginResponse = response.data;
            // dispatch(storeAccessToken(data.accessToken));
            console.log('register',response.data);
            // const id = response.data.infor[0].id
            // dispatch(getUserInfo(id) as any)
            // localStorage.setItem('userInformation', JSON.stringify(response.data.infor))
            // localStorage.setItem('accessToken', data.accessToken);
            toast({
                title: 'Register successful!',
                status: 'success',
                duration: 1500,
                isClosable: true,
            });
            await new Promise(resolve => setTimeout(resolve, 1500));
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Something went wrong!',
                description: 'Maybe this username is being used',
                status: 'error',
                duration: 1500,
                isClosable: true,
            });
        }
    }   
    return (
        <Box className='auth' w='100vw' h='100vh' position='relative' display='flex' justifyContent='center' alignItems='center'>
            <RegisterForm onSubmit={handleRegister}/>
        </Box>
    )
 }