import React,{useState, useRef, useEffect} from 'react';
import { Box, IconButton, Input,Text, Spinner, Flex, useDisclosure,Modal, ModalOverlay, ModalCloseButton, ModalHeader, ModalContent, ModalBody, Button, ModalFooter, Avatar, useFocusEffect, Image } from '@chakra-ui/react';
import {Icon} from '@chakra-ui/icons'
import Navbar from '../component/Navbar';
import {getUserById, ISinglePost} from '../type/common';
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
import { useParams } from 'react-router';
import dayjs from 'dayjs'
import { BsCameraFill } from 'react-icons/bs';
import { getUserInfo, IUser, userSelector } from '../type/UserSlice';
interface IProp{
  isOpenAva: boolean;
  onOpenAva: () => void;
  onCloseAva: () => void;
  userid: number
}
export default function ModalChangeAva({onOpenAva, isOpenAva, onCloseAva, userid}:IProp){
  const dispatch = useDispatch<AppDispatch>()
  const {user} = useSelector(userSelector)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<any[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const flexRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<IUser>()

  useEffect(() => {
    dispatch(getUserInfo(userid))
  },[])
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
    setDownloadUrl([])
    // console.log(image)
    URL.revokeObjectURL(image);
  }
  
  const closeModal = async () => {
    setDownloadUrl([])
    setSelectedImages([])
    onCloseAva()
    console.log(images)
  }
  const updateAva = async (url: string | undefined) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/auth/updateAvaUserid=${userid}`, {profilePic: url})
      dispatch(getUserInfo(userid))
      
    } catch(error){console.log(error)}
  }
  const handleUpPost = async () => {
    setLoading(true)
    await uploadFiles();
    updateAva(downloadUrl[0])
    console.log(downloadUrl[0]);
    
    closeModal()
  }
    return (
    <Modal closeOnOverlayClick={false} isCentered isOpen={isOpenAva} onClose={onCloseAva}>
        <ModalOverlay />
        <ModalContent maxW={500}>
        <ModalHeader textAlign='center'>Change your profile picture</ModalHeader>
        <ModalCloseButton />
        <Box w='100%' h='1px' bgColor='gray.200' mb={2} ></Box>
        <ModalBody>

            <Flex alignItems='center'>
            {/* <Avatar name={userInformation[0]?.name!} size="md" mr={2}/> */}
            <Flex w='100%' flexDirection='column' alignItems='center'>
                <Text fontSize="18px" fontWeight='medium' mr='auto'>
                {/* {userInformation[0]?.name!} */}
                  The photo you will choose should be 1:1 aspect ratio:
                </Text>
                <Flex color="gray.500" fontSize="13px" alignItems='center' mr='auto'>
                <Icon as={IoEarth} mr={1}/>
                <Text>Public</Text>
                </Flex>
            </Flex>
            </Flex>
            <Flex>
            </Flex>
            <Flex alignItems='center' justifyContent='center'>
            <Flex flexDirection='column' justifyContent='center' alignItems='center' mr={4}>
                <label style={{color: 'grey'}}>
                Choose an image
                <input
                    className='select-input'
                    type="file"
                    hidden
                    onChange={handleSelected}
                />
                </label>
                {/* <p>{selectedImages.length === 0 ? undefined : `${selectedImages.length} selected `}</p> */}
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
            <Button 
              colorScheme='blue' onClick={handleUpPost} w='100%'
              isDisabled={selectedImages.length === 0 ? true : false}
            >
              {loading ? <Spinner /> : 'Post'}
            </Button>
        </ModalFooter>
        </ModalContent>
    </Modal>
    )
}