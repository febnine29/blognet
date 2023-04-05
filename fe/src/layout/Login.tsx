import React,{useState} from 'react';
import { Box, 
        useToast
    } from '@chakra-ui/react'
import axios from 'axios';
import LoginForm from './LoginForm'; 
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router';
import { storeAccessToken } from '../features/auth/AuthSlice';
interface LoginResponse {
    accessToken: string;
}
export default function Login(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const toast = useToast()
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
                username,
                password,
            });
            const data: LoginResponse = response.data;
            dispatch(storeAccessToken(data.accessToken));
            localStorage.setItem('userInformation', JSON.stringify(response.data.data))
            localStorage.setItem('accessToken', data.accessToken);
            toast({
                title: 'Login successful',
                status: 'success',
                duration: 1500,
                isClosable: true,
            });
            await new Promise(resolve => setTimeout(resolve, 1500));
            navigate('/');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Login failed',
                description: 'Wrong username or password',
                status: 'error',
                duration: 1500,
                isClosable: true,
            });
        }
    };

    return (
        <Box w='100vw' h='100vh' position='relative' display='flex' justifyContent='center' alignItems='center' bg='gray.200'>
        {accessToken && accessToken !== 'undefined' ?
            <Navigate to='/' />
        :  
            <LoginForm onSubmit={handleLogin} />
        }
        </Box>
    );
}