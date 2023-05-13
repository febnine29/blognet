import React,{useState} from 'react';
import { Box, Spinner, Flex, Divider, Text } from '@chakra-ui/react';
import {Icon} from '@chakra-ui/icons'
import { Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { BsPeopleFill } from 'react-icons/bs'
import { useSelector } from 'react-redux';
import { followedSelector } from '../type/ListFollowedSlice';
import FollowedList from './FollowedList';
import { postSelector } from '../type/PostSlice';

export default function NavSide(){
    const {followed} = useSelector(followedSelector)
    const {posts} = useSelector(postSelector)
    return (
        <Box className='nav-side' w='30%'  minW='380px'>
            <Flex flexDirection="column" justifySelf="flex-start">
            {/* <Link to="/">
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
            </Link> */}
            <Text fontSize='20px' textAlign='left' fontWeight='semibold'mb={1} color='gray.700' pl={3}>Peoples you are following</Text>
            <Flex bgColor='white' w='100%' flexDirection='column-reverse'>
                {followed?.map((person) => (
                    <FollowedList key={person.id} person={person} posts={posts}/>
                ))}
            </Flex>
        </Flex>
    </Box>
    )
}