import React,{useState, useRef, useEffect} from 'react';
import { Box, IconButton, Input,Text, Spinner, Flex, useDisclosure,Modal, ModalOverlay, ModalCloseButton, ModalHeader, ModalContent, ModalBody, Button, ModalFooter, Avatar, useFocusEffect, Image, AvatarGroup } from '@chakra-ui/react';
import {Icon} from '@chakra-ui/icons'
import Navbar from '../component/Navbar';
import {IFollowersList, ISinglePost} from '../type/common';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import '../css/home.css'
import SinglePost from '../component/SinglePost';
import { getAllPosts, postSelector, newPost } from '../type/PostSlice';
import { getAllComments } from '../type/CommentSlice';
import {IoMdImages} from 'react-icons/io';
import { IoEarth, IoClose } from "react-icons/io5";
import {RiEmotionLaughLine} from 'react-icons/ri'
import { AppDispatch } from '../app/store';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase';
import { dateNow } from '../type/common';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs'
import { BsCameraFill, BsCheckLg } from 'react-icons/bs';
import {MdOutlineMail, MdWorkOutline} from 'react-icons/md'
import { TbBuildingCommunity } from 'react-icons/tb';
import ModalChangeAva from '../component/ModalChangeAva';
import { getUserInfo, userSelector } from '../type/UserSlice';
import ModalChangeCover from '../component/ModalChangeCover';
import { AiOutlinePlus } from 'react-icons/ai';
import ModalMessenger from '../component/ModalMessenger';
import { FaFacebookMessenger } from 'react-icons/fa';
import FollowersAvatar from '../component/FollowersAvatar';
interface IUser{
  id: number;
  username: string;
  email: string | null;
  name: string;
  coverPic: string | null;
  profilePic: string | null;
  city: string | null;
  website: string | null
}
export default function Profile(){
  const { userIdParams } = useParams()
  const navigate = useNavigate()
  const accessToken = localStorage.getItem('accessToken')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenAva,
    onOpen: onOpenAva,
    onClose: onCloseAva,
  } = useDisclosure();
  const {
    isOpen: isOpenCover,
    onOpen: onOpenCover,
    onClose: onCloseCover,
  } = useDisclosure();
  const {
    isOpen: isOpenMess,
    onOpen: onOpenMess,
    onClose: onCloseMess,
  } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>()
  const { posts, postLoading } = useSelector(postSelector)
  const {user} = useSelector(userSelector)
  const [uid, setUid] = useState()
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [coverPic, setCoverpic] = useState()
  const [profilePic, setProfilepic] = useState()
  const [city, setCity] = useState()
  const [website, setWebsite] = useState()
  const [isFollow, setIsFollow] = useState<boolean>()
  const [followers, setFollowers] = useState<IFollowersList[] | null>(null)
  useEffect(() => {
    // console.log('user', user);
    
  },[user])
  useEffect(() => {
    const fetchUser = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${userIdParams}`);
        // if(response.data.info){
            setUsername(response.data.info.name);
            setProfilepic(response.data.info.profilePic)
            setCoverpic(response.data.info.coverPic)
            setEmail(response.data.info.email)
            setCity(response.data.info.city)
            // console.log(response.data.info);
            
        // }
    } catch (error) {
        console.error(error);
        }
    };
    const countFollowers = async () => {
      try {
          const res = await axios.post('http://localhost:5000/api/v1/follow/getFollowers',{
              id: parseInt(userIdParams!)
          })
          setFollowers(res.data.result)
      } catch(error){console.log(error)}
    }
    countFollowers()
    fetchUser();
},[userIdParams])
  const userInformation = JSON.parse(localStorage.getItem('userInformation') || '{}');
  const postsFilter = posts?.filter((post) => post.userId === parseInt(userIdParams!))
  useEffect(() => {
      dispatch(getAllPosts());
      dispatch(getAllComments())
    }, []);
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<any[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const flexRef = useRef<HTMLDivElement>(null);
  const [newpost, setNewPost] = useState<ISinglePost>({
    descrip: "",
    userId: userInformation[0]?.id!,
    img: downloadUrl,
    createdAt: '',
    isLiked: "0"
  })
  // ----------SHOW PREVIEW SELECTED IMAGES----------

  const uploadFiles = async () => {
    const promises: Promise<any>[] = []
    if(images){
    for (let i = 0; i < images.length; i++) {
    const imageRef = ref(storage, `${images[i]?.name!}`);
    const result = await uploadBytes(imageRef, images[i])
    .then((e) => {
    const promise = getDownloadURL(ref(storage, `${e.metadata.fullPath}`))
    .then((url) => {
      downloadUrl.push(url)
    });
      promises.push(promise);
      console.log("success", e.metadata.fullPath);
      console.log('url', downloadUrl);
    
    })
    .catch((error) => {
      console.log(error);
    });
    }
    await Promise.all(promises);
    setLoading(false)
    setImages([])
    } else {
      setLoading(false)
    }
    };
  const handleSelected = (event: any) => {
      setImages(event.target.files);
      onSelectFile(event)
  }
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (flexRef.current) {
        flexRef.current.scrollTop = flexRef.current.scrollHeight;
      }
    }, 700);
    
    return () => clearTimeout(timeoutId);
  }, [selectedImages]);

  const onSelectFile = (event: any) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file: any) => {
        return URL.createObjectURL(file);
    });
    setSelectedImages([...selectedImages, ...imagesArray])
    // FOR BUG IN CHROME
    // event.target.value = "";
  };

  function deleteHandler(image: any) {
    setSelectedImages(selectedImages.filter((e) => e !== image));
    // console.log(image)
    URL.revokeObjectURL(image);
  }
  
  const closeModal = async () => {
    setDownloadUrl([])
    setSelectedImages([])
    onClose()
    console.log(images)
  }
  const handleUpPost = async () => {
    setLoading(true)
    await uploadFiles();
    dispatch(newPost(newpost))
    closeModal()
  }
  const checkRelation = async () => {
    try{
      const res = await axios.post('http://localhost:5000/api/v1/follow/checkRelation',{
        followerUserId: userInformation[0].id!,
        followedUserId: parseInt(userIdParams!)
      })
      if(res.data.result === 'new relation'){
        setIsFollow(false)
      } 
        
      // if(res.status === 201){
      // } else if(res.status === 400){
        
      // }
      // return res.status === 201
    } catch(error){
      console.log(error);
      setIsFollow(true)
    }
  }
  const follow = async () => {
    try{
      const res = await axios.post('http://localhost:5000/api/v1/follow/setfollow',{
        followerUserId: userInformation[0].id!,
        followedUserId: parseInt(userIdParams!)
      })
      checkRelation()
    } catch(error){console.log(error)}
  }
  const unfollow = async () => {
    try{
      const res = await axios.post('http://localhost:5000/api/v1/follow/unfollow',{
        followerUserId: userInformation[0].id!,
        followedUserId: parseInt(userIdParams!)
      })
      checkRelation()
    } catch(error){console.log(error)}
  }

  useEffect(() => {
    checkRelation()
    
  },[userIdParams])
  useEffect(() => {
    console.log('isFollow', isFollow);

  },[isFollow])
  useEffect(() => {
    let now = dayjs()
    let output = now.format('YYYY-MM-DD HH:mm:ss')
    setNewPost({ ...newpost, createdAt: output })
  },[dispatch])

  return (
      <Box>
          <Navbar />
          <Flex className='main-body' w='100%' h='100%' p={4} display='flex' flexDirection='column' bgColor="#fbfbfb" m="auto">
            <Flex flexDirection='column' w='910px' className='shadow-box' mb={4} m='auto' bgColor='white' borderRadius='10px'>
                <Box position='relative' className='cover-pic' h='350px' w='100%' borderBottomWidth='2px' borderBottomColor='gray.200' overflow='hidden'
                  backgroundImage={coverPic}
                  backgroundSize='cover'
                >
                </Box>
                <Flex className='info' justifyContent='flex-start' alignItems='center' w='100%' h='100px' py={3} px={6}> 
                    <Box className="avatar-box" position='relative' w='200px' h='100%'>
                        <Avatar name={username} src={profilePic} size='2xl' position='absolute' top='-50px' left={0} borderWidth='3px' borderColor='white'/>
                        {userInformation[0]?.id! === parseInt(userIdParams!) ? 
                        <IconButton 
                          position='absolute' bottom='0px' right='0' aria-label='picture' icon={<BsCameraFill />} borderRadius='50%' borderWidth='2px' borderColor='white'
                          onClick={onOpenAva}
                        />
                        : undefined}
                    </Box>
                    <Flex flexDirection='column' textAlign='left' pl={4} w='100%'>
                        <Text fontSize='30px' fontWeight='semibold'>{username}</Text>
                        <Flex alignItems="center">
                          <AvatarGroup size='sm' max={1} fontSize='12px' > 
                          {followers?.map((follower) => (
                            <FollowersAvatar key={follower.id} follower={follower}/>
                          ))}
                          </AvatarGroup>
                          <Text fontSize={15} color='gray.500' ml={2}>{followers?.length! > 1 ? `${followers?.length} Followers` : `${followers?.length} Follower`}</Text>
                        </Flex>
                    </Flex>
                    {accessToken && accessToken !== 'undefined' ?
                    <Flex 
                      alignItems={userInformation[0]?.id! === parseInt(userIdParams!) ? 'flex-end' : 'flex-end'} 
                      h='100%'
                      pb={2}
                    >
                      {userInformation[0]?.id! === parseInt(userIdParams!) ? 
                        <Button onClick={onOpenCover} leftIcon={<BsCameraFill />}>Change cover</Button>
                      : <Flex >
                          <Button 
                            colorScheme={isFollow ? 'green' : 'blue'}
                            leftIcon={isFollow ? <BsCheckLg /> : <AiOutlinePlus />} 
                            borderRadius='50px' 
                            mr={2}
                            onClick={isFollow ? unfollow : follow}
                          >
                            {/* {isFollow !== undefined && (isFollow ? 'UnFollow' : 'follow')} */}
                            {isFollow ? 'Unfollow' : 'Follow'}
                          </Button>
                          {isFollow}
                          <Button
                            onClick={onOpenMess}
                            borderRadius='50px'
                            color='#4200eb'
                          ><Icon as={FaFacebookMessenger} mr={2}/>Message</Button>
                        </Flex>}
                    </Flex>
                    : undefined}
                </Flex>
            </Flex>
            <Flex h='100%' p={4} display='flex' flexDirection='row' justifyContent='space-between'>
                <Flex w='380px' maxH='600px' className='shadow-box' flexDirection='column' p={6} mb={4} ml='auto' mr={6} bgColor='white' borderRadius='10px'>
                  <Box fontSize='20px' textAlign='left' fontWeight='semibold'>Introduce</Box>
                  {userInformation[0]?.id! === parseInt(userIdParams!) ? 
                  <Button color='gray.600' my={4}>Edit Your Informations</Button>
                  : undefined}
                  <Flex alignItems='center' color='gray.600' mt={userInformation[0]?.id! === parseInt(userIdParams!) ? '0' : '8'}><Icon as={MdWorkOutline} mr={2} color='gray.600' fontSize={20}/>Working at</Flex>
                  <Flex alignItems='center' color='gray.600' my={2}><Icon as={MdOutlineMail} mr={2} color='gray.600' fontSize={20}/>Email address</Flex>
                  <Flex alignItems='center' color='gray.600'><Icon as={TbBuildingCommunity} mr={2} color='gray.600' fontSize={20}/>Live at</Flex>
                </Flex>
                
                <Flex className='blog-side' mr='auto' w='500px' justifyItems='center' alignItems="center" flexDirection='column' > 
                  {userInformation[0]?.id! === parseInt(userIdParams!) ? 
                    <Flex flexDirection='column' className='create-status shadow-box' px={3} py={3} mb={4} bgColor='white' borderRadius='10px' maxW='590px' minW="500px">
                    <Flex alignItems='center' w='100%'>
                        <Avatar name={userInformation[0]?.name!} w='40px' h='40px' mr={2} src={user?.profilePic!}/>
                        <Button w="100%" onClick={onOpen} fontWeight='medium' textAlign='left' color="gray.400" borderRadius='50px'>
                        Write your new status, {userInformation[0]?.name!}!...
                        </Button>
                    </Flex>
                    <Box w='100%' h='1px' bgColor='gray.200' my={2}></Box>
                    <Flex>
                        <Button onClick={onOpen} leftIcon={<IoMdImages fontSize="30px" color='green'/>} w='50%' mr={1} bgColor="transparent" _hover={{bgColor: 'gray.100'}} borderRadius='50px' color='gray.600'>Images</Button>
                        <Button onClick={onOpen} leftIcon={<RiEmotionLaughLine fontSize="30px" color='orange'/>} w='50%' bgColor="transparent" _hover={{bgColor: 'gray.100'}} borderRadius='50px' color='gray.600'>Emotions/Activity</Button>
                    </Flex>
                    <Modal closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent maxW={500}>
                        <ModalHeader textAlign='center'>New Status</ModalHeader>
                        <ModalCloseButton />
                        <Box w='100%' h='1px' bgColor='gray.200' mb={2} ></Box>
                        <ModalBody>

                            <Flex alignItems='center'>
                            <Avatar name={userInformation[0]?.name!} size="md" mr={2} src={user?.profilePic!}/>
                            <Flex w='100%' flexDirection='column' alignItems='center'>
                                <Text fontSize="18px" fontWeight='medium' mr='auto'>
                                {userInformation[0]?.name!}
                                </Text>
                                <Flex color="gray.500" fontSize="13px" alignItems='center' mr='auto'>
                                <Icon as={IoEarth} mr={1}/>
                                <Text>Public</Text>
                                </Flex>
                            </Flex>
                            </Flex>
                            <Flex>
                            <Input 
                                variant='unstyled'my={2}
                                placeholder='Write something...'
                                onChange={(e) => setNewPost({...newpost, descrip: e.target.value})}
                            />
                            </Flex>
                            <Flex alignItems='center' justifyContent='center'>
                            <Flex flexDirection='column' justifyContent='center' alignItems='center' mr={4}>
                                <label style={{color: 'grey'}}>
                                + files or images
                                <input
                                    className='select-input'
                                    type="file"
                                    multiple
                                    hidden
                                    onChange={handleSelected}
                                />
                                </label>
                                <p>{selectedImages.length === 0 ? undefined : `${selectedImages.length} selected `}</p>
                            </Flex>
                            <Flex ref={flexRef} flexDirection='column' className="images" maxW={300} maxH={400} overflowY={selectedImages ? 'scroll' : 'unset'} >
                                {selectedImages &&
                                selectedImages.reverse().map((image, index) => {
                                    return (
                                    <Box key={image} className="image" w={280} position='relative'>
                                        <img src={image} width='100%' height="auto" />
                                        <IconButton 
                                            aria-label='close'
                                            onClick={() => deleteHandler(image)} 
                                            position='absolute' 
                                            right="2" top="2"
                                            icon={<IoClose fontSize='18px'/>}
                                            borderRadius='50%'
                                            bgColor='white'
                                        />
                                    </Box>
                                    );
                                })}
                            </Flex>
                            </Flex>

                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='blue' onClick={handleUpPost} w='100%'>
                            {loading ? <Spinner /> : 'Post'}
                            </Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>
                    </Flex>
                    : undefined}
                    {postLoading && <Spinner sx={{position:'absolute', left: '50%', top: '30%'}}/>}
                    {postsFilter?.map((post) => (
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
            </Flex>
              
          </Flex>
          <ModalChangeAva userid={userInformation[0]?.id!} onOpenAva={onOpenAva} isOpenAva={isOpenAva} onCloseAva={onCloseAva}/>
          <ModalChangeCover userid={userInformation[0]?.id!} onOpenCover={onOpenCover} isOpenCover={isOpenCover} onCloseCover={onCloseCover}/>
          <ModalMessenger onOpenMess={onOpenMess} isOpenMess={isOpenMess} onCloseMess={onCloseMess} userid={parseInt(userIdParams!)} currentUserId={userInformation[0]?.id!} username={username!}/>
      </Box>
  );
}