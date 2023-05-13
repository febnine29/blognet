import React, { useEffect,useState } from 'react';
import { Box, Flex,Menu, Link, MenuButton, MenuList, MenuItem, Avatar, Text, Button,Image, Input, useDisclosure } from '@chakra-ui/react'
import { Icon } from "@chakra-ui/icons"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { BsHeart, BsHeartFill, BsPeopleFill, BsThreeDots } from 'react-icons/bs';
import { FaHeart, FaRegHeart, FaRegComment, FaRegShareSquare,FaRegTrashAlt } from 'react-icons/fa'
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
import '../css/navside.css'
import FollowedListItem from './FollowedListItem';
export default function FollowedList({person, posts}:any){
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [ava, setAva] = useState('')
    const [followers, setFollowers] = useState()
    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${person.followedUserId}`);
            // if(response.data.info){
                setName(response.data.info.name);
                setAva(response.data.info.profilePic)
                // console.log(response.data.info);
                
            // }
        } catch (error) {
            console.error(error);
        }
    };
    const countFollowers = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/v1/follow/getFollowers',{
                id: person.followedUserId
            })
            setFollowers(res.data.result.length)
        } catch(error){console.log(error)}
    }
    
    const findPost = posts.filter((item:any) => item.userId === person.followedUserId)
    useEffect(() => {
        fetchUser()
        countFollowers()
       
    },[person.followedUserId])
    useEffect(() => {
        console.log(findPost);
        
    },[findPost])
    return(
        <Flex flexDirection='column' px={2} pb={4} pt={3} borderRadius='10px' className='navside' mt={2} mb={2}>
            <Flex className='post-info' alignItems='center' w="100%" mb={4}>
                <Avatar name={name} size='md' src={ava} borderWidth='2px' borderColor='purple.600'/>
                <Box ml={2}>
                    <Text fontWeight='bold' textAlign='left' fontSize='17px' color="gray.600"
                        onClick={() => navigate(`/profileId/${person.followedUserId}`)}
                        _hover={{cursor: 'pointer', textDecoration: 'underline'}}
                    >
                        {name}
                    </Text>
                    <Flex>
                        <Icon as={BsPeopleFill} color='gray.600' mr={1}/>
                        <Text fontSize='12px' color='gray.600' textAlign='left'>
                            {followers! > 1 ? `${followers} Followers` : `${followers} Follower`}
                        </Text>
                    </Flex>
                </Box>
            </Flex>
            <Flex w='100%' flexDirection='column' maxH='500px' overflowY='auto' px='4px'
                css={{
                    '&::-webkit-scrollbar': {
                      width: '5px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#bababa',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#4200eb',
                    },
                  }}
            >
                {findPost?.map((post:any) => (
                    <FollowedListItem 
                        key={post.id}
                        postId={post.id}
                        descrip={post.descrip} 
                        img={post.img} 
                        userId={post.userId} 
                        createdAt={post.createdAt}
                        isLiked={post.isLiked}
                    />
                    
                ))}
            </Flex>
        </Flex>
    )
}