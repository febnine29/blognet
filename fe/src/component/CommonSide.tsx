import React, { useEffect, useState} from 'react';
import { Box, Text,Flex, Avatar,Icon, Image } from '@chakra-ui/react';
import { ITopUser } from '../type/common';
import axios from 'axios';
import TopUserItem from './TopUserItem';
import '../css/commonside.css'
import FollowedListItem from './FollowedListItem';
import { useNavigate } from 'react-router';
import { FiClock } from 'react-icons/fi';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import dayjs from 'dayjs';
import { FaHeart, FaRegCommentDots } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { commentSelector } from '../type/CommentSlice';
interface ITopPost{
    id: number,
    descrip: string,
    img: string[],
    userId: number,
    createdAt: string,
    isLiked: string,
    num_likes: number
}
export default function CommonSide(){
    const navigate = useNavigate()
    const [username, setUsername] = React.useState<any>()
    const [ava, setAva] = React.useState<any>()
    const [isFollow, setIsFollow] = useState<boolean>()
    const [topUsers, setTopUsers] = useState<ITopUser[] | null>(null)
    const [post, setPost] = useState<ITopPost | null>(null)
    
    const {comments} = useSelector(commentSelector)
    const cmtArray = comments?.filter((comment) => comment.postId === post?.id)
    const fetchTopUser = async () => {
        try{
            const res = await axios.get(`http://localhost:5000/api/v1/follow/getMostFollowed`)
            setTopUsers(res.data.result)
        } catch(error){console.log(error);
        }
    }
    const fetchPostMostLikes = async () => {
        try{
            const res = await axios.get(`http://localhost:5000/api/v1/posts/getPostMostLikes`)
            setPost(res.data.data[0])
        }catch(error){console.log(error);
        }
    }
    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${post?.userId}`);
            // if(response.data.info){
                setUsername(response.data.info.name);
                setAva(response.data.info.profilePic)
                // console.log(response.data.info);
            // }
        } catch (error) {
            console.error(error);
            }
    };
    
    useEffect(() => {
        fetchTopUser()
        fetchPostMostLikes()
        fetchUser()
    },[post])
    console.log(post);
    
    return (
        <Box className='recent-side' w='30%' minW='350px'>
            <Flex flexDirection='column' borderRadius='10px' className='shadow-box top-user' p={4}>
                <Text fontSize='18px' textAlign='left' fontWeight='semibold' mb={4} color='gray.700'>Top users most followers</Text>
                {topUsers?.map((user, index) => (
                    <TopUserItem 
                        key={index} 
                        user={user}
                        index={index}
                    />
                ))}
            </Flex>
            <Flex flexDirection='column' borderRadius='10px' className='shadow-box top-user' p={4} mt={4}>
                <Text fontSize='18px' textAlign='left' fontWeight='semibold' mb={4} color='gray.700'>Post most likes</Text>
                {post && 
                <Flex 
                    className='shadow-box' px={4} pt={4} pb={1} mb={4} bgColor='white' borderRadius='10px' flexDirection='column'
                    onClick={() => navigate(`/singlepostid/${post?.id}`)}
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
                                    {dayjs(post?.createdAt).format('DD/MM lúc HH:mm')}
                                </Text>
                            </Flex>
                        </Box>
                    </Flex>
                    <Box className='description' textAlign='left' py={4}>{post.descrip}</Box>
                        {post.img?.length! < 1 ? 
                            <Image src={post.img[0]} mb={2}/>
                        : 
                            <Swiper
                            pagination={{
                            type: "fraction",
                            }}
                            navigation={true}
                            modules={[Pagination, Navigation]}
                            className="mySwiper"
                        >
                            {post.img?.map((image:any, index:any) => (
                                <Flex key={index} overflowX='auto'>
                                    <Image src={image} mb={2} maxW='150px'/>
                                </Flex>
                            ))}
                        </Swiper>
                        }
                        <Flex className='common-tool' flexDirection='column' mt={2}>
                            <Flex className='react-stat' flexDirection='row' alignItems='center' textAlign='left' mb={2} px={2}>
                                {post.num_likes > 0 ? 
                                    <Flex className='likes-stat' flexDirection='row' alignItems='center' textAlign='left'>
                                        <Icon as={FaHeart} fontSize='18px' color="white" mr={1} bgColor="#4200eb" p="3.5px" borderRadius="50%"/>
                                        <Text fontSize='13px' color='gray' textAlign='left'>
                                            {post.num_likes > 1 ? `${post.num_likes} likes` : `${post.num_likes} like`}
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
                }
            </Flex>
        </Box>
    )
}