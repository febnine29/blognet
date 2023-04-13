import React,{useState} from 'react';
import { Box, Spinner, Flex, Divider } from '@chakra-ui/react';
import Navbar from '../component/Navbar';
import { getAllPostsApi, getPostById } from '../type/common';
import {Icon} from '@chakra-ui/icons'
import { Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { BsPeopleFill } from 'react-icons/bs'
import axios from 'axios'
import '../css/home.css'
interface LoginResponse {
    accessToken: string;
}
interface IPost{
    id: number;
    descrip: string;
    createdAt: string;
    userId: number;
    img: string;
}
export default function Home(){
    const [loading, setLoading] = React.useState(false)
    const [posts, setPosts] = React.useState<IPost[] | null>(null)
    React.useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
          try {
            const response = await fetch(getAllPostsApi);
            const postsData = await response.json();
            setPosts(postsData.data);
          } catch (error) {
            console.error(error);
          } finally{
            setLoading(false)
          }
        };
        // const getPost = () => {
        //     axios.get(`http://localhost:5000/api/v1/posts/getPostId=4`)
        //     .then(res => console.log(res.data))
        //     .catch(err => console.error(err))
        // }
        // getPost()
        fetchData();
      }, []);
    console.log('posts: ', posts)
    
    return (
        <Box>
            <Navbar />
            <Box className='main-body' w='100vw' h='100%' p={4} display='flex' flexDirection='row' bgColor="#fbfbfb">
                <Box className='nav-side' w='25%' paddingRight={5}>
                    <Flex flexDirection="column" justifySelf="flex-start">
                    <Link to="/">
                    <Flex
                        padding={3}
                        alignItems="center"
                        _hover={{ bgColor: "gray.200", borderRadius: '10px' }}
                        cursor="pointer"
                        style={{fontWeight: 'bold', color: '#878787'}}
                    >
                       <Icon as={AiFillHome} fontSize={18} mr={2} color='blue.500'/> Home
                    </Flex>
                    </Link>
                    <Link to="/">
                    <Flex
                        padding={3}
                        alignItems="center"
                        _hover={{ bgColor: "gray.200", borderRadius: '10px' }}
                        cursor="pointer"
                        style={{fontWeight: 'bold', color: '#878787'}}
                    >
                       <Icon as={BsPeopleFill} fontSize={18} mr={2} color='blue.500'/> Friends
                    </Flex>
                    </Link>

                    <Link to="/">
                    <Flex
                        padding={3}
                        alignItems="center"
                        _hover={{ bgColor: "gray.200", borderRadius: '10px' }}
                        cursor="pointer"
                    >
                        Projects
                    </Flex>
                    </Link>
                </Flex>
                </Box>
                <Box className='blog-side' w='50%' px={2} py={4} bgColor='white' borderRadius='10px'> 
                    <Box>

                    </Box>
                    {loading && <Spinner />}
                    {posts?.map((post) => (
                        <Box key={post.id}>
                            <Box>{post.descrip}</Box>
                        </Box>
                    ))}
                </Box>
                <Box className='recent-side' w='25%'>recent-side</Box>
            </Box>
        </Box>
    );
}