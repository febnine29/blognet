import React, { useEffect } from 'react';
import { Box, Flex, Avatar, Text, Button } from '@chakra-ui/react'
import { Icon } from "@chakra-ui/icons"
import dayjs from 'dayjs';
import axios from 'axios'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { FaHeart, FaRegHeart, FaRegComment, FaRegShareSquare } from 'react-icons/fa'
import { IComment } from '../type/common';
interface SinglePostProp{
    postId: number;
    userId: number;
    img: string;
    descrip: string;
    createdAt: string
}
dayjs.extend(relativeTime)
export default function SinglePost({postId, descrip, userId, img, createdAt}: SinglePostProp){
    const date = dayjs(createdAt).fromNow();
    const dateFormat = dayjs(createdAt).format('DD/MM lúc hh:mm')
    const [output, setOutput] = React.useState('')
    const [username, setUsername] = React.useState<string | null>(null)
    const [likes, setLikes] = React.useState<string[] | null>(null)
    const [comments, setCmt] = React.useState<IComment[] | null>(null)
    const [showComment, setShowComment] = React.useState(false)
    const userInformation = JSON.parse(localStorage.getItem('userInformation') || '{}');
    const idUser = userInformation.id;
    console.log(userInformation)
    const validate = () => {
        if(date !== 'a few seconds ago' && date !== 'a minute ago'){
            setOutput(dateFormat)
        } else {
            setOutput(date)
        }
    }
    
    useEffect(() => {
        const getLikes = async () => {
            try {
                axios.get(`http://localhost:5000/api/v1/likes/getLikes=${postId}`)
                .then(response => {
                    setLikes(response.data.data)
                })
            } catch (error){
                console.log(error)
            }
        }
        const getComments = async () => {
            try {
                axios.get(`http://localhost:5000/api/v1/comments/cmt=${postId}`)
                .then(response => {
                    setCmt(response.data.comment)
                })
            } catch (error){
                console.log(error)
            }
        }
        getLikes();
        getComments()
    }, [postId]);
    
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
        validate()
    },[])
    return (
        <Box className='shadow-box' px={4} pt={4} pb={1} mb={4} bgColor='white' borderRadius='10px' maxW="590px" minW="500px">
            <Flex className='post-info' alignItems='center'>
                <Avatar size='md' src={img} />
                <Box ml={2}>
                    <Text fontWeight='bold' textAlign='left' fontSize='17px'>{username}</Text>
                    <Text fontSize='12px' color='gray' textAlign='left'>{output}</Text>
                </Box>
            </Flex>
            <Box className='description' textAlign='left' py={4}>{descrip}</Box>
            <Flex className='common-tool' flexDirection='column'>
                {likes?.length! > 0 ? 
                    <Flex className='react-stat' flexDirection='row' alignItems='center' textAlign='left' mb={2}>
                        <Icon as={FaHeart} fontSize='16px' color="#20007d" mr={1}/>
                        <Text fontSize='13px' color='gray' textAlign='left'>
                            {likes?.length! > 1 ? `${likes?.length!} likes` : `${likes?.length!} like`}
                        </Text>
                    </Flex>
                : 
                 ''}
                <Flex className='tool-buttons' w="100%" py={2} justifyContent='space-around' borderTopWidth="1px" borderTopColor='gray.200'>
                    <Button 
                        bgColor='transparent'
                        size='sm'
                        leftIcon={<Icon as={FaRegHeart} fontSize='18px' color="#676175"/>}
                        color="#676175"
                        fontWeight="medium"
                    >
                        Like
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
                <Flex className="comment-box" w="100%" borderTopWidth="1px" borderTopColor='gray.200' py={2}>
                    {comments?.map((comment) => (
                        <Box key={comment.id}>{comment.descrip}</Box>
                    ))}
                </Flex>
                )}
            </Flex>
        </Box>
    )
}   