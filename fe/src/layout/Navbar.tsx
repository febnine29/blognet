import React from 'react';
import { Box } from '@chakra-ui/react'
export default function Navbar(){
    return (
        <Box w='100%' h='70px' color='darkolivegreen' borderBottom='1px' borderBottomColor='lightgray' display='flex' justifyContent='space-between' alignItems='center' paddingX='20px'>
            <Box fontSize='25px'>BlogNet</Box>
            <Box>search</Box>
            <Box>Login</Box>
        </Box>
    )
}