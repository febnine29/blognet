import React,{useState} from 'react';
import { Box, Spinner, Flex, Divider } from '@chakra-ui/react';
import Navbar from '../component/Navbar';
import { getAllPostsApi, getPostById } from '../type/common';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import '../css/home.css'
import NavSide from '../component/NavSide';
import RecentSide from '../component/RecentSide';
import SinglePost from '../component/SinglePost';
import { getAllPosts, postSelector } from '../type/PostSlice';
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
  const dispatch = useDispatch<AppDispatch>()
  const { posts, postLoading } = useSelector(postSelector)
  React.useEffect(() => {
      dispatch(getAllPosts())
    }, []);
  console.log('posts: ', posts)
  
  return (
      <Box>
          <Navbar />
          <Box className='main-body' w='100vw' h='100%' p={4} display='flex' flexDirection='row' bgColor="#fbfbfb">
              <NavSide />
              <Flex className='blog-side' w='50%' justifyItems='center' alignItems="center" flexDirection='column'> 
                  <Box className='create-status shadow-box' px={2} py={4} mb={4} bgColor='white' borderRadius='10px' maxW='590px' minW="500px">
                    Modal create post
                  </Box>
                  {postLoading && <Spinner />}
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