import React, { useEffect,useState } from 'react';
import { Box, Flex,Menu, Link, MenuButton, MenuList, MenuItem, Avatar, Text, Button,Image, Input, useDisclosure } from '@chakra-ui/react'
import { Icon } from "@chakra-ui/icons"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { BsHeart, BsHeartFill, BsPeopleFill, BsThreeDots } from 'react-icons/bs';
import { FaHeart, FaRegHeart, FaRegComment, FaRegShareSquare,FaRegTrashAlt, FaRegCommentDots } from 'react-icons/fa'
import { IComment, ILike, like, unLike, updateLiked,SingleComment } from '../type/common';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, getAllPosts } from '../type/PostSlice';
import { AppDispatch } from '../app/store';
import { newComment } from '../type/CommentSlice';
import { commentSelector, getAllComments} from '../type/CommentSlice';
import { BiSend } from 'react-icons/bi';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SingleCommentCp from './SingleCommentCp';
import { IUser } from '../type/UserSlice';
import Alert from './AlertDialog';
import axios from 'axios';
import { followedSelector } from '../type/ListFollowedSlice';
import { FiClock } from 'react-icons/fi';
interface SinglePostProp{
    postId: number;
    userId: number;
    img: string[];
    descrip: string;
    createdAt: string;
    isLiked: string
}
export default function FollowedListItem({postId, descrip, userId, img, createdAt, isLiked}: SinglePostProp){
    const navigate = useNavigate()
    const date = dayjs(createdAt).fromNow();
    const dateFormat = dayjs(createdAt).format('DD/MM lúc HH:mm')
    const [output, setOutput] = React.useState('')

    const [username, setUsername] = React.useState<any>()
    const [ava, setAva] = React.useState<any>()
    const [likes, setLikes] = React.useState<ILike[] | null>(null)
    const {comments} = useSelector(commentSelector)
    const cmtArray = comments?.filter((comment) => comment.postId === postId)
    const [showComment, setShowComment] = React.useState(false)
    //-----------------fetch user information:
    const userInformation = JSON.parse(localStorage.getItem('userInformation') || '{}');
    //-----------------display post created at
    const validate = () => {
        if(date !== 'a few seconds ago' && date !== 'a minute ago'){
            setOutput(dateFormat)
        } else {
            setOutput(date)
        }
    }
    //-----------------get comments & likes:
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
    useEffect(() => {
        const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${userId}`);
            // if(response.data.info){
                setUsername(response.data.info.name);
                setAva(response.data.info.profilePic)
                // console.log(response.data.info);
                
            // }
        } catch (error) {
            console.error(error);
            }
        };

        fetchUser();
    }, [userId]);
    useEffect(() => {
        getLikes();
    }, [postId]);
    return (
        <Flex 
            className='shadow-box' px={4} pt={4} pb={1} mb={4} bgColor='white' borderRadius='10px' flexDirection='column'
            onClick={() => navigate(`/singlepostid/${postId}`)}
            cursor='pointer'
            style={{transition:'0.3s ease'}}
            _hover={{bgColor: '#ececec', transition: '0.3s ease'}}
        >
            <Flex className='post-info' alignItems='center' w="100%">
                <Avatar name={username} size='md' src={ava} borderWidth='2px' borderColor='purple.500' w='40px' h='40px'/>
                <Box ml={2}>
                    <Text fontWeight='bold' textAlign='left' fontSize='17px' color="gray.600" >
                        {username}
                    </Text>
                    <Flex alignItems='center'>
                        <Icon as={FiClock} color='gray.500' mr={1} fontSize="15px"/>
                        <Text fontSize='12px' color='gray.600' textAlign='left'>
                            {dayjs(createdAt).format('DD/MM lúc HH:mm')}
                        </Text>
                    </Flex>
                </Box>
            </Flex>
            <Box className='description' textAlign='left' py={4}>{descrip}</Box>
                {img?.length! < 1 ? 
                    <Image src={img[0]} mb={2}/>
                : 
                    <Swiper
                    pagination={{
                    type: "fraction",
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                >
                    {img?.map((image:any, index:any) => (
                        <Flex key={index} overflowX='auto'>
                            <Image src={image} mb={2} maxW='150px'/>
                        </Flex>
                    ))}
                </Swiper>
                }
                <Flex className='common-tool' flexDirection='column' mt={2}>
                    <Flex className='react-stat' flexDirection='row' alignItems='center' textAlign='left' mb={2} px={2}>
                        {likes?.length! > 0 ? 
                            <Flex className='likes-stat' flexDirection='row' alignItems='center' textAlign='left'>
                                <Icon as={FaHeart} fontSize='18px' color="white" mr={1} bgColor="#4200eb" p="3.5px" borderRadius="50%"/>
                                <Text fontSize='13px' color='gray' textAlign='left'>
                                    {likes?.length! > 1 ? `${likes?.length!} likes` : `${likes?.length!} like`}
                                </Text>
                            </Flex>
                        : ''}
                        {cmtArray?.length! > 0 ? 
                            <Flex className='comment-stat' flexDirection='row' alignItems='center' textAlign='left' ml={4}>
                                <Icon as={FaRegCommentDots} fontSize='18px' mr={1} color="#4200eb"/>
                                <Text fontSize='13px' color='gray' textAlign='left'>
                                    {cmtArray?.length! > 1 ? `${cmtArray?.length!} comments` : `${cmtArray?.length!} comment`}
                                </Text>
                            </Flex>
                        : ''}
                    </Flex>
                </Flex>
        </Flex>
    )
}