import React,{useState, useEffect} from 'react';
import { Box,Flex, Text, Avatar, Button, Menu,IconButton, MenuGroup, MenuButton, MenuList, MenuItem,Input, Tabs, TabList, Tab, TabIndicator, TabPanels, TabPanel } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { storeAccessToken } from '../features/auth/AuthSlice';
import { useNavigate, useParams } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';
import { TbLogout, TbSearch } from 'react-icons/tb';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { BsFillPersonFill } from 'react-icons/bs';
import "../css/navbar.css"
import { FaFacebookMessenger } from 'react-icons/fa';
import { Color, IPost } from '../type/common';
import { userSelector } from '../type/UserSlice';
import { IUser } from '../type/UserSlice';
import useDebounce from '../type/useDebounce';
import axios from 'axios';
import SinglePost from '../component/SinglePost';
import TopUserItem from '../component/TopUserItem';
import UserSearch from '../component/UserSearch';

export default function SearchPage() {
    const location = useLocation()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken')
    const {user} = useSelector(userSelector)
    const {string} = useParams()
    const [searchData, setSearchData] = useState(string)
    const [posts, setPosts] = useState<IPost[] | null>(null)
    const [users, setUsers] = useState<IUser[] | null>(null)
    const debouncedSearchData = useDebounce(searchData, 500)

    const searchPosts = async () => {
        try{
            const res = await axios.get(`http://localhost:5000/api/v1/posts/search?query=${searchData}`)
            setPosts(res.data.data)
            // console.log(res.data.data);
            
        } catch(error){
            console.log(error);
            
        }
    }
    const searchUsers = async () => {
        try{
            const res = await axios.get(`http://localhost:5000/api/v1/auth/search?name=${searchData}`)
            setUsers(res.data.result)
            // console.log(res.data.result);
            
        } catch(error){
            console.log(error);
        }
    }
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInformation');
        dispatch(storeAccessToken(''));
        navigate('/login');
    };
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        searchPosts()
        searchUsers()
    }
    useEffect(() => {
        searchPosts()
        searchUsers()
    },[string])
    useEffect(() => {
        console.log(users);
    },[users])
  return (
    <Flex flexDirection='column'>
        <Box
        display="flex"
        alignItems="center"
        paddingX={4}
        paddingY=".5rem"
        className="navbar"
        position='relative'
        justifyContent={user?.id! === undefined ? 'space-between' : ''}
        w='100%'
        >
        <Box fontSize='25px' fontWeight="bold" width='25%' color='white' display='flex' justifyContent='flex-start'>
            <Text onClick={() => navigate('/')} cursor='pointer'>Invisocial</Text>
        </Box>
        <Flex display={user?.id! === undefined ? 'none' : 'block'} width='50%'  
            bgColor='transparent'
            position='relative' 
            borderRadius="50px" h="40px" px={1}
        >
            {location.pathname.includes('/chatId') ? <></> : 
            <Flex w='400px' mx='auto' bgColor='white' h='100%'
                borderRadius='50px'
                alignItems='center'
                px={4}
            > 
                <Icon as={TbSearch} fontSize='20px'/>
                <form onSubmit={handleSearch}>
                    <Input 
                    variant='unstyle'
                    value={searchData}
                    onChange={(event) => setSearchData(event.target.value)}
                    />
                </form>
            </Flex> 
            }
        </Flex>
        {accessToken && accessToken !== 'undefined' ?
            <Box width='25%' display='flex' flexDirection='row' alignItems='center' justifyContent='flex-end'>
            <IconButton aria-label='mess' icon={<FaFacebookMessenger />} w='40px' h='40px' color={Color} borderRadius='50%' mr={2}
                onClick={() => navigate(`/chat/0`)}
            />
            <Menu>
                <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<Avatar name={user?.name} src={user?.profilePic!} marginRight=".5rem" w='40px' h='40px'/>}
                _hover={{bgColor: 'transparent'}}
                _active={{bgColor: 'transparent'}}
                bgColor="transparent"
                />
                <MenuList style={{padding: '10px', width:'300px'}} >
                <MenuItem mb={2} display='flex' flexDirection='column' _hover={{ bgColor: 'transparent'}} borderRadius='10px' sx={{boxShadow: 'rgba(163, 163, 163, 0.5) 0px 0px 4px 0px;'}} bgColor='white'>
                    <Flex w="100%" flexDirection='row' onClick={() => navigate(`/profileId/${user?.id}`)} alignItems='center' borderRadius='10px' _hover={{bgColor:'gray.100'}} pt={2} px={1} pb={3}
                    
                    > 
                    <Avatar name={user?.name} src={user?.profilePic!} marginRight=".5rem" size='sm'/>
                    <Text fontWeight='bold' fontSize='17px'
                        
                    >{user?.name}</Text>
                    </Flex>
                    <Box w="100%" h="1.5px" bgColor="gray.200" my={1}></Box>
                    <Flex
                    
                    onClick={() => navigate(`/profileId/${user?.id}`)}
                    w="100%" _hover={{bgColor:'gray.100'}} p={2} justifyContent='center' alignItems='center' borderRadius='10px'>
                    <Text align='center' color='rgba(22, 0, 163, 0.7)' fontWeight='bold'
                    >
                        See Profile
                    </Text>
                    </Flex>
                </MenuItem>
                <MenuItem onClick={handleLogout} _hover={{ borderRadius: '5px'}} color="red">
                    <Icon as={TbLogout} fontSize={20} marginRight={2}/>Log-out
                </MenuItem>
                </MenuList>
            </Menu>
            </Box>
            :  
            <Box width='25%' display='flex' flexDirection='row' alignItems='center' justifyContent="flex-end">
                <Button 
                onClick={() => navigate("/login")} 
                bgColor="transparent"
                color="white"
                borderWidth="2px"
                borderColor="white"
                _hover={{color: "#6304c2", background: "white"}}
                >
                Login
                </Button>
            </Box> 
        }

        </Box>
        <Flex w='500px' mx='auto' pt={4}>
            <Tabs position="relative" variant="unstyled">
                <TabList>
                    <Tab>Posts</Tab>
                    <Tab>Peoples</Tab>
                </TabList>
                <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="blue.500"
                borderRadius="1px"
                />
                <TabPanels>

                <TabPanel w='100%'>
                    {posts?.length !== 0 ? posts?.map((post) => (
                        <SinglePost 
                            key={post.id} 
                            postId={post.id}
                            descrip={post.descrip} 
                            img={post.img} 
                            userId={post.userId} 
                            createdAt={post.createdAt}
                            isLiked={post.isLiked}
                        />
                        )) 
                        : 'No matched any post'
                    }
                </TabPanel>

                <TabPanel w='100%'>
                    {users?.length !== 0 ? users?.map((user) => (
                        <UserSearch
                            user={user}
                        />
                        ))
                        : 'No matched any user'
                    }
                </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    </Flex>
  );
}