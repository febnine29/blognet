import React,{useEffect, useState, useRef} from 'react';
import { Box, Flex, Avatar, Button, Input, Text } from '@chakra-ui/react';
import { Icon } from "@chakra-ui/icons"
import { useSelector, useDispatch } from 'react-redux';
import {BiDislike, BiSend} from 'react-icons/bi';
import { AwesomeButton } from 'react-awesome-button';
import { postSelector } from '../type/PostSlice';
import { IComment,SingleComment } from '../type/common';
import axios from 'axios'
import dayjs from 'dayjs';
import { setUseProxies } from 'immer';
import { AppDispatch } from '../app/store';
import { commentSelector, newComment } from '../type/CommentSlice';
import { dateNow } from '../type/common';
import { AiOutlineLike } from 'react-icons/ai';
import '../css/comment.css'
import { log } from 'console';
interface CommentProp{
    userId: number;
    postId: number;
    createdAt: string;
    comments: IComment[] | undefined
}
export default function Comments({ userId, postId, createdAt,comments}: CommentProp){
    const dispatch = useDispatch<AppDispatch>()
    // const output = date.slice(0, -4);
    const [avaComment, setAva] = useState<string | null>('')
    const [username, setUser] = useState<string>('')
    const [descrip, setDescrip] = useState<string>('')
    const [comment, setComment] = useState<SingleComment>({
        descrip: '',
        userId: userId,
        postId: postId,
        createdAt: '',
        isLiked: '0'
    })
    // const {comments} = useSelector(commentSelector)
    // const postComments = comments?.filter((comment) => comment.postId === postId)
    const [disable, setDisable] = useState<boolean>(false)
    const validate = () => {
        return comment.descrip.length === 0
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        dispatch(newComment(comment))
        setComment({...comment, descrip: ''})
    }
    // fetch avatar for each comment
    // useEffect(() => {
        const fetchAvaComment = async(id:number) => {
            try {
                await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${id}`)
                .then(response => {
                    setAva(response.data.info[0].coverPic)
                    setUser(response.data.info[0].name)
                    console.log(response.data.info);
                    
                })
            } catch(error) {
                console.log(error)
            }
        }
        // const result = postComments?.map((comment) => fetchAvaComment(comment.id))
        // console.log(result);
        
    //     ;
    // },[comment])
    
    // const userInfo = comments?.map((user) => fetchAvaComment(user.id))
    
    useEffect(() => {
        let now = dayjs()
        let dateCmt = now.format('YYYY-MM-DD HH:mm:ss')
        setComment({...comment, createdAt: dateCmt})
        validate()
        console.log(comment)
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
            {comments?.map((comment) => (
                <Flex key={comment.id} position='relative' textAlign='left' alignItems='center' mb={7} >
                    <Avatar name={username} size="sm" mr={2}></Avatar>
                    {/* <Flex flexDirection='column'> */}
                        <Flex display='' maxW='428px' position='relative' px={2} py={1} bgColor="#f3f3f3" borderRadius='10px' borderWidth='1px' borderColor='gray.100' flexDirection='column'>
                            <Text fontSize="13px" fontWeight='bold'>{username}</Text>
                            <Box >{comment.descrip}</Box>
                        </Flex>
                        <Flex position='absolute' left='40px' bottom='-25px'color='gray.600' className='tool-comment' pl={2}>
                            <Box className='item'><Icon as={AiOutlineLike} cursor='pointer' fontSize={18}/></Box>
                            {/* {comment.isLiked ? '' : ''} */}
                            <Box className='item'><Icon as={BiDislike} cursor='pointer' fontSize={18}/></Box>
                            <Box className='item reply'><Text fontSize="12px" fontWeight='semibold' _hover={{textDecoration: 'underline', cursor: 'pointer'}}>Reply</Text></Box>
                            <Box className='item'><Text fontSize="12px" color='gray.500'>{dayjs(comment.createdAt).fromNow().slice(0, -4)}</Text></Box>
                        </Flex>
                    {/* </Flex> */}
                </Flex>
            ))}
        </Flex>
    )
}