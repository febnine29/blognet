import React, { useEffect } from 'react';
import { Box, Flex, Avatar, Text, Button } from '@chakra-ui/react'
import { Icon } from "@chakra-ui/icons"
import dayjs from 'dayjs';
import axios from 'axios'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { FaHeart, FaRegHeart, FaRegComment, FaRegShareSquare } from 'react-icons/fa'
import { IComment, ILike, like, unLike, updateLiked } from '../type/common';
import  Comments  from './Comments'
import { useDispatch } from 'react-redux';
import { getAllPosts } from '../type/PostSlice';
import { AppDispatch } from '../app/store';
interface SinglePostProp{
    postId: number;
    userId: number;
    img: string[];
    descrip: string;
    createdAt: string;
    isLiked: string
}
dayjs.extend(relativeTime)
export default function SinglePost({postId, descrip, userId, img, createdAt, isLiked}: SinglePostProp){
    const dispatch = useDispatch<AppDispatch>()
    // date format:
    const date = dayjs(createdAt).fromNow();
    const dateFormat = dayjs(createdAt).format('DD/MM lúc hh:mm')
    const [output, setOutput] = React.useState('')
    // post actions:
    const [username, setUsername] = React.useState<string | null>(null)
    const [likes, setLikes] = React.useState<ILike[] | null>(null)
    const [comments, setCmt] = React.useState<IComment[] | null>(null)
    const [showComment, setShowComment] = React.useState(false)
    // fetch user information:
    const userInformation = JSON.parse(localStorage.getItem('userInformation') || '{}');
    // display post created at
    const validate = () => {
        if(date !== 'a few seconds ago' && date !== 'a minute ago'){
            setOutput(dateFormat)
        } else {
            setOutput(date)
        }
    }
    // get comments & likes:
    const getLikes = async () => {
        try {
            await axios.get(`http://localhost:5000/api/v1/likes/getLikes=${postId}`)
            .then(response => {
                setLikes(response.data.result)
            })
        } catch (error){
            console.log(error)
        }
    }
    const getComments = async () => {
        try {
            await axios.get(`http://localhost:5000/api/v1/comments/cmt=${postId}`)
            .then(response => {
                setCmt(response.data.comment)
            })
        } catch (error){
            console.log(error)
        }
    }
    useEffect(() => {
        getLikes();
        getComments()
    }, [postId]);
    const setLike = async () => {
        try {
            await axios.post(`http://localhost:5000/api/v1/likes/like`,{
                userId: userInformation[0].id,
                postId: postId
            })
        } catch (error){
            console.log(error)
        }
    }
    const unLike = async () => {
        try{
            await axios.post(`http://localhost:5000/api/v1/likes/unLike`,{
                userId: userInformation[0].id,
                postId: postId
            })
            .then(response => {
                return response
            })
            .catch(error => {
                return error
            })
        } catch (error) {
            return error
        }
    }
    const updateLiked = async (isLiked: string) => {
        try {
            await axios.put(`http://localhost:5000/api/v1/posts/isLiked=${postId}`,{isLiked})
        } catch (error) {
            return error
        }
    }
    const handleLike = async () => {
        await setLike()
        updateLiked("1") 
        dispatch(getAllPosts())
    }
    const handleUnLike = async () => {
        await unLike()
        updateLiked("0") 
        dispatch(getAllPosts())
    }
    // get user name on post:
    useEffect(() => {
        const fetchUser = async () => {
        try {
        const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${userId}`);
            setUsername(response.data.infor[0].name);
        } catch (error) {
            console.error(error);
            }
        };
        
        fetchUser();
    }, [userId]);

    useEffect(() => {
        validate();
        console.log('isLIked', isLiked)
    },[])

    return (
        <Box className='shadow-box' px={4} pt={4} pb={1} mb={4} bgColor='white' borderRadius='10px' maxW="590px" minW="500px">
            <Flex className='post-info' alignItems='center'>
                <Avatar size='md'/>
                <Box ml={2}>
                    <Text fontWeight='bold' textAlign='left' fontSize='17px'>{username}</Text>
                    <Text fontSize='12px' color='gray' textAlign='left'>{output}</Text>
                </Box>
            </Flex>
            <Box className='description' textAlign='left' py={4}>{descrip}</Box>
            <Flex className='common-tool' flexDirection='column'>
                <Flex className='react-stat' flexDirection='row' alignItems='center' textAlign='left' mb={2} px={2}>
                    {likes?.length! > 0 ? 
                        <Flex className='likes-stat' flexDirection='row' alignItems='center' textAlign='left'>
                            <Icon as={FaHeart} fontSize='16px' color="#20007d" mr={1}/>
                            <Text fontSize='13px' color='gray' textAlign='left'>
                                {likes?.length! > 1 ? `${likes?.length!} likes` : `${likes?.length!} like`}
                            </Text>
                        </Flex>
                    : ''}
                    {comments?.length! > 0 ? 
                        <Flex className='comment-stat' ml='auto' flexDirection='row' alignItems='center' textAlign='left' justifyContent='flex-end'>
                            <Text fontSize='13px' color='gray' textAlign='left'>
                                {comments?.length! > 1 ? `${comments?.length!} comments` : `${comments?.length!} comment`}
                            </Text>
                        </Flex>
                    : ''}
                </Flex>
                <Flex className='tool-buttons' w="100%" py={2} justifyContent='space-around' borderTopWidth="1px" borderTopColor='gray.200'>
                    <Button 
                        bgColor='transparent'
                        size='sm'
                        leftIcon={<Icon as={isLiked === "1" ? FaHeart : FaRegHeart} fontSize='18px' color="#676175"/>}
                        color="#676175"
                        fontWeight={isLiked === "1" ? "bold" : "medium"}
                        onClick={isLiked === "1" ? handleUnLike : handleLike}
                    >
                        {isLiked === "1" ? 'Liked' : 'Like'}
                    </Button>
                    <Button 
                        bgColor='transparent'
                        size='sm'
                        leftIcon={<Icon as={FaRegComment} fontSize='18px' color="#676175"/>}
                        color="#676175"
                        fontWeight="medium"
                        onClick={() => setShowComment(!showComment)}
                    >
                        Comment
                    </Button>
                    <Button 
                        bgColor='transparent'
                        size='sm'
                        leftIcon={<Icon as={FaRegShareSquare} fontSize='18px' color="#676175"/>}
                        color="#676175"
                        fontWeight="medium"
                    >
                        Share
                    </Button>
                </Flex>
                {showComment && (
                    <Comments comments={comments} userId={userInformation[0].id} postId={postId}/>
                )}
            </Flex>
        </Box>
    )
}   