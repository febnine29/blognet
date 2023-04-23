import React,{useEffect, useState, useRef} from 'react';
import { Box, Flex, Avatar, Button, Input, Text } from '@chakra-ui/react';
import { Icon } from "@chakra-ui/icons"
import { useSelector, useDispatch } from 'react-redux';
import {BiSend} from 'react-icons/bi';
import { AwesomeButton } from 'react-awesome-button';
import { postSelector } from '../type/PostSlice';
import { IComment,SingleComment } from '../type/common';
import axios from 'axios'
import dayjs from 'dayjs';
import { setUseProxies } from 'immer';
import { AppDispatch } from '../app/store';
import { commentSelector, newComment } from '../type/CommentSlice';
interface CommentProp{
    userId: number;
    postId: number;
}
export default function Comments({ userId, postId}: CommentProp){
    const dispatch = useDispatch<AppDispatch>()
    const now = dayjs()
    const timeCreate = now.format('YYYY-MM-DD HH:mm:ss')
    const [avaComment, setAva] = useState<string | null>('')
    const [username, setUser] = useState<string>('')
    const [descrip, setDescrip] = useState<string>('')
    const createdAt = timeCreate
    const [comment, setComment] = useState<SingleComment>({
        descrip: '',
        userId: userId,
        postId: postId,
        createdAt: timeCreate
    })
    const {comments} = useSelector(commentSelector)
    const postComments = comments?.filter((comment) => comment.postId === postId)
    const [disable, setDisable] = useState<boolean>(false)
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
    // fetch avatar for each comment
    useEffect(() => {
        const fetchAvaComment = async() => {
            try {
                await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${comment.userId}`)
                .then(response => {
                    setAva(response.data.infor[0].coverPic)
                    setUser(response.data.infor[0].name)
                    
                })
            } catch(error) {
                console.log(error)
            }
        }
        fetchAvaComment();
    },[comment])
    useEffect(() => {
        validate()
    },[comment.descrip])
    return (
        <Flex className="comment-box" flexDirection='column' w="100%" borderTopWidth="1px" borderTopColor='gray.200' py={2}>
            <Flex textAlign='left' alignItems='center' mb={2}>
                <Avatar name={username} size="sm" mr={2}></Avatar>
                    <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                    <Input
                        placeholder='Write a comment...'
                        value={comment.descrip}
                        onChange={(e) => setComment({...comment, descrip: e.target.value})}
                    >
                    </Input>
                    <Button type='submit' variant='ghost'>
                        <Icon as={BiSend} fontSize='20px'/>
                    </Button>
                    </form>
                
            </Flex>
            {postComments?.map((comment) => (
                <Flex key={comment.id} textAlign='left' alignItems='center' mb={4} >
                    <Avatar name={username} size="sm" mr={2}></Avatar>
                    <Flex w='min-content' minW='428px' position='relative' px={2} py={1} bgColor="#f3f3f3" borderRadius='10px' borderWidth='1px' borderColor='gray.100' flexDirection='column'>
                        <Text fontSize="13px" fontWeight='bold'>{username}</Text>
                        <Box sx={{wordBreak: 'break-word'}} >{comment.descrip}</Box>
                        {/* <Box position="absolute" bottom="-1rem" left="0" bgColor="#f3f3f3">
                            test
                        </Box> */}
                    </Flex>
                </Flex>
            ))}
        </Flex>
    )
}