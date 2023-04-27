import React,{useEffect, useState, useRef} from 'react';
import { Box, Flex, Avatar, Button, Input, Text } from '@chakra-ui/react';
import { Icon } from "@chakra-ui/icons"
import { useSelector, useDispatch } from 'react-redux';
import {BiDislike, BiSend} from 'react-icons/bi';
import { IComment,SingleComment } from '../type/common';
import axios from 'axios'
import dayjs from 'dayjs';
import { AppDispatch } from '../app/store';
import { commentSelector, newComment } from '../type/CommentSlice';
import { AiOutlineLike } from 'react-icons/ai';
import '../css/comment.css'
export default function SingleCommentCp({id,descrip, userId,postId, createdAt, isLiked}: IComment){
    const [name, setName] = useState('')
    useEffect(() => {
        const fetchUser = async () => {
            try {
            const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${userId}`);
                setName(response.data.infor[0].name)
                console.log(response.data.infor[0].name)
            } catch (error) {
                console.error(error);
                }
            };
            
        fetchUser();
    },[userId])
    const dispatch = useDispatch<AppDispatch>()
    const [comment, setComment] = useState<SingleComment>({
        descrip: '',
        userId: userId,
        postId: postId,
        createdAt: '',
        isLiked: '0'
    })
    const validate = () => {
        if(comment.descrip.length === 0){
            return false
        } else return true
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        dispatch(newComment(comment))
        setComment({...comment, descrip: ''})
    }
    useEffect(() => {
        let now = dayjs()
        let dateCmt = now.format('YYYY-MM-DD HH:mm:ss')
        setComment({...comment, createdAt: dateCmt})
        validate()
        console.log(comment)
    },[comment.descrip])
    return (
        <Flex  position='relative' textAlign='left' alignItems='center' mb={7} >
            <Avatar name={name} size="sm" mr={2}></Avatar>
            {/* <Flex flexDirection='column'> */}
                <Flex display='' maxW='428px' position='relative' px={2} py={1} bgColor="#f3f3f3" borderRadius='10px' borderWidth='1px' borderColor='gray.100' flexDirection='column'>
                    <Text fontSize="13px" fontWeight='bold'>{name}</Text>
                    <Box >{descrip}</Box>
                </Flex>
                <Flex position='absolute' left='40px' bottom='-27px'color='gray.600' className='tool-comment' pl={2}>
                    <Box className='item'><Icon as={AiOutlineLike} cursor='pointer' fontSize={18}/></Box>
                    {/* {comment.isLiked ? '' : ''} */}
                    <Box className='item'><Icon as={BiDislike} cursor='pointer' fontSize={18}/></Box>
                    <Box className='item reply'><Text fontSize="12px" fontWeight='semibold' _hover={{textDecoration: 'underline', cursor: 'pointer'}}>Reply</Text></Box>
                    <Box className='item'><Text fontSize="12px" color='gray.500'>{dayjs(createdAt).fromNow().slice(0, -4)}</Text></Box>
                </Flex>
            {/* </Flex> */}
        </Flex>
    )
}