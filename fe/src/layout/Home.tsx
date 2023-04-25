import React,{useState, useRef, useEffect} from 'react';
import { Box, Image,Progress, Input,Text, Spinner, Flex, Divider, useDisclosure,Modal, ModalOverlay, ModalCloseButton, ModalHeader, ModalContent, ModalBody, Button, ModalFooter, Avatar, useFocusEffect } from '@chakra-ui/react';
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
import {RiEmotionLaughLine} from 'react-icons/ri'
import { AppDispatch } from '../app/store';
import { ref, uploadBytesResumable, getDownloadURL, connectStorageEmulator } from 'firebase/storage'
import { storage } from '../firebase';
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
  const userInformation = JSON.parse(localStorage.getItem('userInformation') || '{}');
  useEffect(() => {
      dispatch(getAllPosts());
      dispatch(getAllComments())
    }, []);
  // const [imageFile, setImageFile] = useState<File[] | null>(null)
  const [imageFile, setImageFile] = useState<File>()
  const [downloadURL, setDownloadURL] = useState<string[]>([''])
  const [isUploading, setIsUploading] = useState(false)
  const [progressUpload, setProgressUpload] = useState(0)
  const [newpost, setNewPost] = useState<ISinglePost>({
    descrip: "",
    userId: userInformation.id,
    img: downloadURL,
    createdAt: "",
    isLiked: "0"
  })
  // ----------SHOW PREVIEW SELECTED IMAGES----------
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const flexRef = useRef<HTMLDivElement>(null);
  const onSelectFile = (files: any) => {
      const selectedFiles = files.target.files;
      const selectedFilesArray = Array.from(selectedFiles);

      const imagesArray = selectedFilesArray.map((file: any) => {
      return URL.createObjectURL(file);
      });
      setSelectedImages([...selectedImages, ...imagesArray])
      // FOR BUG IN CHROME
      files.target.value = "";
  };
  function deleteHandler(image: any) {
      setSelectedImages(selectedImages.filter((e) => e !== image));
      URL.revokeObjectURL(image);
  }
  useEffect(() => {
      const timeoutId = setTimeout(() => {
          if (flexRef.current) {
            flexRef.current.scrollTop = flexRef.current.scrollHeight;
          }
        }, 1000);
      
        return () => clearTimeout(timeoutId);
  }, [selectedImages]);
  // ----------HANDLE UPLOAD SELECTED IMAGES--------------
  const handleSelectedFile = (files: any) => {
    if (files && files[0].size < 15000000) {
      setImageFile(files[0])
      console.log(files[0])
    } else {
      console.error('File size is to large')
    }
  }
  const handleUploadFile = async () => {
    if (imageFile) {
        const name = imageFile.name
        const storageRef = ref(storage, `image/${name}`)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setProgressUpload(progress) 
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
          },
          (error) => {
            console.error(error.message)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              //url is download url of file
              setDownloadURL([...downloadURL, url])
            })
          },
          )
        }
      else {
        console.error('File not found')
      }
  }
  // const handleUploadFile = async () => {
  //   if (imageFile) {
  //     for(let i = 0; i < imageFile.length; i++ ){
  //       const name = imageFile[i].name
  //       const storageRef = ref(storage, `image/${name}`)
  //       const uploadTask = uploadBytesResumable(storageRef, imageFile[i])
  //       uploadTask.on(
  //         'state_changed',
  //         (snapshot) => {
  //           const progress =
  //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //           setProgressUpload(progress) 
  //           switch (snapshot.state) {
  //             case 'paused':
  //               console.log('Upload is paused')
  //               break
  //             case 'running':
  //               console.log('Upload is running')
  //               break
  //           }
  //         },
  //         (error) => {
  //           console.error(error.message)
  //         },
  //         () => {
  //           getDownloadURL(uploadTask.snapshot.ref).then((url) => {
  //             //url is download url of file
  //             setDownloadURL([...downloadURL, url])
  //           })
  //         },
  //         )
  //       }
  //     }
  //     else {
  //       console.error('File not found')
  //     }
  // }
  const handleUpPost = async () => {
    // dispatch(newPost(newpost))
    await handleUploadFile()
    console.log(downloadURL)
    // onClose()
  }
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
                    <Modal closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent maxW={500}>
                        <ModalHeader textAlign='center'>Write New Post</ModalHeader>
                        <ModalCloseButton />
                        <Box w='100%' h='1px' bgColor='gray.200' mb={2} ></Box>
                        <ModalBody>

                        <Input
                          type="file"
                          multiple={true}
                          placeholder="Select images/files to upload"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={(files) => {
                            handleSelectedFile(files.target.files);
                            onSelectFile(files)
                          }}
                        />
                       <Box>
                          {imageFile && (
                            <>
                            <Flex ref={flexRef} flexDirection='column' className="images" maxW={300} maxH={400} overflowY={selectedImages ? 'scroll' : 'unset'} >
                                {selectedImages &&
                                selectedImages.reverse().map((image, index) => {
                                    return (
                                    <Box key={image} className="image">
                                        <img src={image} width='300' height="auto" alt="upload" />
                                        <Progress value={progressUpload} />
                                        <Button onClick={() => deleteHandler(image)}>
                                            delete image
                                        </Button>
                                    </Box>
                                    );
                                })}
                            </Flex>
                            </>
                          )}
                        </Box>
                        </ModalBody>

                        <ModalFooter>
                          <Button colorScheme='blue' onClick={handleUpPost} w='100%'>
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