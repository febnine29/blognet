import React,{useState} from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';
import LoginForm from './LoginForm'; 
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { storeAccessToken } from '../features/auth/AuthSlice';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
interface LoginResponse {
    accessToken: string;
}
export default function Home(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const accessToken = localStorage.getItem('accessToken')
    const user = JSON.parse(localStorage.getItem('userInformation') || '{}');
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInformation');
        dispatch(storeAccessToken(''))
        navigate('/login')
    };

    return (
        <Box>
            <h1>Home</h1>
            {accessToken && accessToken !== 'undefined' ?
            <Box>
                <p>You are logged in.</p>
                <button onClick={handleLogout}>Logout</button>
            </Box>
            :  
            <Box>
                <p>You need to <Link to='/login'>login</Link></p>
            </Box> 
             }

        </Box>
    );
}