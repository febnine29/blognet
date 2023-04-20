import React,{useEffect, useState} from 'react';
import { Box, Flex, Avatar, Button, Input, Text } from '@chakra-ui/react';
import { Icon } from "@chakra-ui/icons"
import { useSelector, useDispatch } from 'react-redux';
import {BiSend} from 'react-icons/bi';
import { AwesomeButton } from 'react-awesome-button';
import { postSelector } from '../type/PostSlice';
import { IComment } from '../type/common';
import axios from 'axios'
import dayjs from 'dayjs';
import { setUseProxies } from 'immer';
import { getAllComments } from '../type/CommentSlice';
import { AppDispatch } from '../app/store';
interface CommentProp{
    comments: IComment[] | null;
    userId: number;
    postId: number;
}
interface SingleComment{
    descrip: string;
    userId: number;
    postId: number;
    createdAt: string
}
export default function Comments({comments, userId, postId}: CommentProp){
    const dispatch = useDispatch<AppDispatch>()
    const {posts} = useSelector(postSelector)
    const now = dayjs()
    const timeCreate = now.format('YYYY-MM-DD HH:mm:ss')
    const [avaComment, setAva] = useState<string | null>('')
    const [username, setUser] = useState<string | null>('')
    const [descrip, setDescrip] = useState<string>('')
    // const userId = userId
    // const postId = postId
    const createdAt = timeCreate
    const [comment, setComment] = useState<SingleComment>({
        descrip: '',
        userId: userId,
        postId: postId,
        createdAt: timeCreate
    })
    const [disable, setDisable] = useState<boolean>(false)
    const validate = () => {
        if(comment.descrip.length === 0){
            return false
        } else return true
    }
    const handleComment = async () => {
        try {
            axios.post(`http://localhost:5000/api/v1/comments`,{
                descrip,
                userId,
                postId,
                createdAt
            })
        } catch(error){console.log(error)}
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        handleComment()
        dispatch(getAllComments(postId))
        console.log(comment);
        // comments?.push(...comments,{descrip, userId, postId, createdAt})
        setDescrip('')
    }
    // fetch avatar for each comment
    useEffect(() => {
        const fetchAvaComment = async() => {
            try {
                await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${comment.userId}`)
                .then(response => {
                    setAva(response.data.infor[0].coverPic)
                    setUser(response.data.infor[0].name)
                    console.log(response.data.infor[0]);
                    
                })
            } catch(error) {
                console.log(error)
            }
        }
        fetchAvaComment();
    },[comment])
    useEffect(() => {
        validate()
        console.log('typing')
    },[comment.descrip])
    return (
        <Flex className="comment-box" flexDirection='column' w="100%" borderTopWidth="1px" borderTopColor='gray.200' py={2}>
            <Flex textAlign='left' alignItems='center' mb={2}>
                <Avatar size="sm" mr={2}></Avatar>
                    <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                    <Input
                        placeholder='Write a comment...'
                        value={descrip}
                        onChange={(e) => setDescrip(e.target.value)}
                    >
                    </Input>
                    <Button type='submit' variant='ghost'>
                        <Icon as={BiSend} fontSize='20px' style={{transform: 'rotate(45degree)'}}/>
                    </Button>
                    </form>
                
            </Flex>
            {comments?.map((comment) => (
                <Flex key={comment.id} textAlign='left' alignItems='center' mb={4}>
                    <Avatar size="sm" mr={2}></Avatar>
                    <Flex w='100%' px={2} py={1} borderRadius='10px' borderWidth='1px' borderColor='gray.100' flexDirection='column'>
                        <Text fontSize="13px" fontWeight='bold'>{username}</Text>
                        <Box>{comment.descrip}</Box>
                    </Flex>
                </Flex>
            ))}
        </Flex>
    )
}