import React from 'react';
import { Box } from '@chakra-ui/react';
import RegisterForm from '../component/RegisterForm';
 export default function Register(){
    const handleRegister = () => {

    }
    return (
        <Box>
            <RegisterForm onSubmit={handleRegister}/>
        </Box>
    )
 }