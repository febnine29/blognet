import React,{useState, useRef, useEffect} from 'react';
import { Box, IconButton, Input,Text, Spinner, Flex, useDisclosure,Modal, ModalOverlay, ModalCloseButton, ModalHeader, ModalContent, ModalBody, Button, ModalFooter, Avatar, useFocusEffect } from '@chakra-ui/react';
import {Icon} from '@chakra-ui/icons'
import Navbar from '../component/Navbar';
import {ISinglePost} from '../type/common';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import '../css/home.css'
import NavSide from '../component/NavSide';
import RecentSide from '../component/RecentSide';
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
import dayjs from 'dayjs'
import { getAllChatRooms } from '../type/ChatRoomSlice';

export default function Home(){
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch<AppDispatch>()
  const { posts, postLoading } = useSelector(postSelector)
  const userInformation = JSON.parse(localStorage.getItem('userInformation') || '{}');
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
    let now = dayjs()
    let output = now.format('YYYY-MM-DD HH:mm:ss')
    const newupdate = { ...newpost, createdAt: output }
    dispatch(newPost(newupdate))
    closeModal()
  }
  const validate = () => {
    return newpost.descrip.length === 0
  }
  useEffect(() => {
    validate()
  },[newpost.descrip || newpost.img])
  
  useEffect(()=> {
    dispatch(getAllChatRooms())
  },[])
  return (
      <Box>
          <Navbar />
          <Box className='main-body' w='100vw' h='100%' p={4} display='flex' flexDirection='row' bgColor="#fbfbfb">
              <NavSide />
             
              <Flex className='blog-side' w='50%' justifyItems='center' alignItems="center" flexDirection='column'> 
                {userInformation[0]?.id! === undefined ? undefined
                  : <Flex flexDirection='column' className='create-status shadow-box' px={3} py={3} mb={4} bgColor='white' borderRadius='10px' maxW='590px' minW="500px">
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
                  <Modal closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent maxW={500}>
                      <ModalHeader textAlign='center'>New Status</ModalHeader>
                      <ModalCloseButton />
                      <Box w='100%' h='1px' bgColor='gray.200' mb={2} ></Box>
                      <ModalBody>

                        <Flex alignItems='center'>
                          <Avatar name={userInformation[0]?.name!} size="md" mr={2}/>
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
                        <Button colorScheme='blue' onClick={handleUpPost} w='100%' isDisabled={validate()}>
                          {loading ? <Spinner /> : 'Post'}
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  </Flex> }
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