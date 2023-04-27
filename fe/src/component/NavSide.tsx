import React,{useState} from 'react';
import { Box, Spinner, Flex, Divider } from '@chakra-ui/react';
import Navbar from '../component/Navbar';
import { getAllPostsApi, getPostById } from '../type/common';
import {Icon} from '@chakra-ui/icons'
import { Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { BsPeopleFill } from 'react-icons/bs'

export default function NavSide(){
    return (
        <Box className='nav-side' w='25%' paddingRight={5}>
            <Flex flexDirection="column" justifySelf="flex-start">
            <Link to="/">
                <Flex
                    padding={3}
                    alignItems="center"
                    _hover={{ bgColor: "gray.200", borderRadius: '10px' }}
                    cursor="pointer"
                    style={{fontWeight: 'bold', color: '#878787'}}
                >
                    <Icon as={AiFillHome} fontSize={18} mr={2} color='blue.500'/> Home
                </Flex>
            </Link>
            <Link to="/">
                <Flex
                    padding={3}
                    alignItems="center"
                    _hover={{ bgColor: "gray.200", borderRadius: '10px' }}
                    cursor="pointer"
                    style={{fontWeight: 'bold', color: '#878787'}}
                >
                    <Icon as={BsPeopleFill} fontSize={18} mr={2} color='blue.500'/> Friends
                </Flex>
            </Link>

            <Link to="/profileId/1">
                <Flex
                    padding={3}
                    alignItems="center"
                    _hover={{ bgColor: "gray.200", borderRadius: '10px' }}
                    cursor="pointer"
                >
                    Projects
                </Flex>
            </Link>
        </Flex>
    </Box>
    )
}