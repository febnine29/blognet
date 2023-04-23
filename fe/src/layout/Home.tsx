import React,{useState} from 'react';
import { Box, Input,Text, Spinner, Flex, Divider, useDisclosure,Modal, ModalOverlay, ModalCloseButton, ModalHeader, ModalContent, ModalBody, Button, ModalFooter, Avatar } from '@chakra-ui/react';
import Navbar from '../component/Navbar';
import { getAllPostsApi, getPostById } from '../type/common';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import '../css/home.css'
import NavSide from '../component/NavSide';
import RecentSide from '../component/RecentSide';
import SinglePost from '../component/SinglePost';
import { getAllPosts, postSelector } from '../type/PostSlice';
import { getAllComments } from '../type/CommentSlice';
import {IoMdImages} from 'react-icons/io';
import {RiEmotionLaughLine} from 'react-icons/ri'
import { AppDispatch } from '../app/store';
interface LoginResponse {
  accessToken: string;
}
interface IPost{
  id: number;
  descrip: string;
  createdAt: string;
  userId: number;
  img: string[];
  isLiked: string
}
export default function Home(){
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch<AppDispatch>()
  const { posts, postLoading } = useSelector(postSelector)
  const [name, setName] = useState<string>('')
  const userInformation = JSON.parse(localStorage.getItem('userInformation') || '{}');
  React.useEffect(() => {
      dispatch(getAllPosts());
      dispatch(getAllComments())
      // const getUserInfo = () => {
        // const userInformation = JSON.parse(localStorage.getItem('userInformation') || '{}');
        // setName(userInformation[0].name)
      // }
      // getUserInfo()
    }, []);
  
  return (
      <Box>
          <Navbar />
          <Box className='main-body' w='100vw' h='100%' p={4} display='flex' flexDirection='row' bgColor="#fbfbfb">
              <NavSide />
              <Flex className='blog-side' w='50%' justifyItems='center' alignItems="center" flexDirection='column'> 
                  <Flex flexDirection='column' className='create-status shadow-box' px={3} py={3} mb={4} bgColor='white' borderRadius='10px' maxW='590px' minW="500px">
                    <Flex alignItems='center' w='100%'>
                      <Avatar name={userInformation[0]?.name!} w='40px' h='40px' mr={2}/>
                      <Button w="100%" onClick={onOpen} fontWeight='medium' textAlign='left' color="gray.400" borderRadius='50px'>
                        What are you thinking about, {userInformation[0]?.name!}?...
                      </Button>
                    </Flex>
                    <Box w='100%' h='1px' bgColor='gray.200' my={2}></Box>
                    <Flex>
                      <Button onClick={onOpen} leftIcon={<IoMdImages fontSize="30px" color='green'/>} w='50%' mr={1} bgColor="transparent" _hover={{bgColor: 'gray.100'}} borderRadius='50px' color='gray.600'>Images</Button>
                      <Button onClick={onOpen} leftIcon={<RiEmotionLaughLine fontSize="30px" color='orange'/>} w='50%' bgColor="transparent" _hover={{bgColor: 'gray.100'}} borderRadius='50px' color='gray.600'>Emotions/Activity</Button>
                    </Flex>
                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader textAlign='center'>Write New Post</ModalHeader>
                        <ModalCloseButton />
                        <Box w='100%' h='1px' bgColor='gray.200' mb={2} ></Box>
                        <ModalBody>
                          nothing
                        </ModalBody>
                        <ModalFooter>
                          <Button colorScheme='blue' onClick={onClose} w='100%'>
                            Create
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </Flex>
                  {postLoading && <Spinner sx={{position:'absolute', left: '50%', top: '30%'}}/>}
                  {posts?.map((post) => (
                    <SinglePost 
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
              <RecentSide />
          </Box>
      </Box>
  );
}