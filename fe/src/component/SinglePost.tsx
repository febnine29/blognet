import React, { useEffect,useState } from 'react';
import { Box, Flex,Menu, Link, MenuButton, MenuList, MenuItem, Avatar, Text, Button,Image, Input, useDisclosure } from '@chakra-ui/react'
import { Icon } from "@chakra-ui/icons"
import dayjs from 'dayjs';
import axios from 'axios'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BsHeart, BsHeartFill, BsThreeDots } from 'react-icons/bs';
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
import { dateNow } from '../type/common';
import Alert from './AlertDialog';
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
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const date = dayjs(createdAt).fromNow();
    const dateFormat = dayjs(createdAt).format('DD/MM lúc HH:mm')
    const [output, setOutput] = React.useState('')
    
    //-----------------post actions:
    const [username, setUsername] = React.useState<string>('')
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
        getLikes();
    }, [postId]);
    const setLike = async () => {
        try {
            await axios.post(`http://localhost:5000/api/v1/likes/like`,{
                userId: userInformation[0].id!,
                postId: postId
            })
        } catch (error){
            console.log(error)
        }
    }
    const unLike = async () => {
        try{
            await axios.post(`http://localhost:5000/api/v1/likes/unLike`,{
                userId: userInformation[0].id!,
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
        await updateLiked("1") 
        await getLikes()
        dispatch(getAllPosts())
    }
    const handleUnLike = async () => {
        await unLike()
        await updateLiked("0") 
        await getLikes()
        dispatch(getAllPosts())
    }
    const handleDeletePost = () => {
        dispatch(deletePost(postId))
    }
    //-----------------get user name on post:
    useEffect(() => {
        const fetchUser = async () => {
        try {
        const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${userId}`);
            setUsername(response.data.info[0].name);
            
        } catch (error) {
            console.error(error);
            }
        };
        
        fetchUser();
    }, [userId]);
    const [comment, setComment] = useState<SingleComment>({
        descrip: '',
        userId: userInformation[0]?.id!,
        postId: postId,
        createdAt: '',
        isLiked: '0'
    })
    function validateCmt(): boolean {
        return comment.descrip.length === 0
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        let now = dayjs()
        let output = now.format('YYYY-MM-DD HH:mm:ss')
        const newcmt = {...comment, createdAt: output}
        dispatch(newComment(newcmt))
        setComment({...comment, descrip: ''})
    }
    useEffect(() => {
        validateCmt()
    },[comment.descrip])
    useEffect(() => {
        validate();
    },[])
    return (
        <Box className='shadow-box' px={4} pt={4} pb={1} mb={4} bgColor='white' borderRadius='10px' w='500px'>
            <Alert isOpen={isOpen} onOpen={onOpen} onClose={onClose} handleDeletePost={handleDeletePost}/>
            <Flex className='post-info' alignItems='center' w="100%">
                <Avatar name={username} size='md'/>
                <Box ml={2}>
                    <Text fontWeight='bold' textAlign='left' fontSize='17px'
                        onClick={() => navigate(`/profileId/${userId}`)}
                        _hover={{cursor: 'pointer', textDecoration: 'underline'}}
                    >
                        {username}
                    </Text>
                    <Text fontSize='12px' color='gray' textAlign='left'>{output!}</Text>
                </Box>
                {userId === userInformation[0]?.id! ? 
                    <Box ml='auto'>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<BsThreeDots />} variant='ghost' _hover={{bgColor: 'transparent'}} _active={{bgColor: 'transparent'}}/>
                        <MenuList px={2}>
                            <MenuItem 
                                fontWeight='medium' color='red' borderRadius='5px' icon={<FaRegTrashAlt />}
                                onClick={onOpen}
                            >
                                Delete
                            </MenuItem>
                        </MenuList>
                    </Menu> 
                    </Box>
                : undefined}
                
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
                {img?.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Image src={image} mb={2}/>
                    </SwiperSlide>
                ))}
              </Swiper>
            }
            <Flex className='common-tool' flexDirection='column' mt={2}>
                <Flex className='react-stat' flexDirection='row' alignItems='center' textAlign='left' mb={2} px={2}>
                    {likes?.length! > 0 ? 
                        <Flex className='likes-stat' flexDirection='row' alignItems='center' textAlign='left'>
                            <Icon as={FaHeart} fontSize='18px' color="white" mr={1} bgColor="#4200eb" p="3px" borderRadius="50%"/>
                            <Text fontSize='13px' color='gray' textAlign='left'>
                                {likes?.length! > 1 ? `${likes?.length!} likes` : `${likes?.length!} like`}
                            </Text>
                        </Flex>
                    : ''}
                    {cmtArray?.length! > 0 ? 
                        <Flex className='comment-stat' ml='auto' flexDirection='row' alignItems='center' textAlign='left' justifyContent='flex-end'>
                            <Text fontSize='13px' color='gray' textAlign='left'>
                                {cmtArray?.length! > 1 ? `${cmtArray?.length!} comments` : `${cmtArray?.length!} comment`}
                            </Text>
                        </Flex>
                    : ''}
                </Flex>
                <Flex className='tool-buttons' w="100%" py={2} justifyContent='space-around' borderTopWidth="1px" borderTopColor='gray.200'>
                    {userInformation[0]?.id! === undefined ? undefined : 
                        <Button 
                            bgColor='transparent'
                            size='sm'
                            leftIcon={
                                <Icon as={isLiked === "1" ? FaHeart : FaRegHeart} 
                                fontSize='18px' 
                                color={isLiked === "1" ? "#4200eb" : "#676175"}
                                />
                            }
                            color={isLiked === "1" ? "#4200eb" : "#676175"}
                            fontWeight={isLiked === "1" ? "bold" : "medium"}
                            onClick={isLiked === "1" ? handleUnLike : handleLike}
                        >
                            {isLiked === "1" ? 'Liked' : 'Like'}
                        </Button>
                    }
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
                    {userInformation[0]?.id! === undefined ? undefined : 
                        <Button 
                            bgColor='transparent'
                            size='sm'
                            leftIcon={<Icon as={FaRegShareSquare} fontSize='18px' color="#676175"/>}
                            color="#676175"
                            fontWeight="medium"
                        >
                            Share
                        </Button>
                    }
                </Flex>
                    <Flex className="comment-box" flexDirection='column' w="100%" borderTopWidth="1px" borderTopColor='gray.200' py={2}>
                        {showComment && userInformation[0]?.id! !== undefined && (
                        <Flex textAlign='left' alignItems='center' mb={2}>
                        <Avatar name={userInformation[0].name} size="sm" mr={2}></Avatar>
                        <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                            <Input
                            placeholder='Write a comment...'
                            value={comment.descrip}
                            onChange={(e) => setComment({...comment, descrip: e.target.value})}
                            >
                            </Input>
                            <Button type='submit' variant='ghost' isDisabled={validateCmt()}>
                                <Icon as={BiSend} fontSize='20px'/>
                            </Button>
                        </form>
                        </Flex>
                     )}
                    </Flex>
                    {showComment && cmtArray?.map((comment) => (
                        <SingleCommentCp
                            key={comment.id}
                            id={comment.id}
                            descrip={comment.descrip}
                            userId={comment.userId}
                            postId={comment.postId}
                            createdAt={comment.createdAt}
                            isLiked={comment.isLiked}
                        />
                    // <Comments userId={userInformation[0].id} comments={cmtArray} postId={postId} createdAt={createdAt}/>
                    ))}
            </Flex>
        </Box>
    )
}   