import React,{useState, useRef, useEffect} from 'react';
import { Box, IconButton, Input,Text, Spinner, Flex, useDisclosure,Modal, ModalOverlay, ModalCloseButton, ModalHeader, ModalContent, ModalBody, Button, ModalFooter, Avatar, useFocusEffect, Image } from '@chakra-ui/react';
import {Icon} from '@chakra-ui/icons'
import Navbar from '../component/Navbar';
import {getUserById, IMessage, ISinglePost} from '../type/common';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import '../css/home.css'
import { AppDispatch } from '../app/store';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs'
import { BsCameraFill } from 'react-icons/bs';
import { getUserInfo, IUser, userSelector } from '../type/UserSlice';
import InputEmoji from 'react-input-emoji'
import { Socket, io } from 'socket.io-client';
import { TbArrowNarrowRight } from 'react-icons/tb';
interface IProp{
  isOpenMess: boolean;
  onOpenMess: () => void;
  onCloseMess: () => void;
  userid: number,
  currentUserId: number;
  username: string
}
export default function ModalMessenger({onOpenMess, isOpenMess, onCloseMess, userid, currentUserId, username}:IProp){
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [chatId, setChatId] = useState<number>()
    const [loading, setLoading] = useState(false)
    const [isFirst, setFirst] = useState<boolean | null>(null)
    const [text, setText] = useState('')
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    // useEffect(() => {
    //     if (!socket) {
    //         const newSocket = io('http://localhost:8800');
    //         setSocket(newSocket);
    //         newSocket.emit("new-user-add", currentUserId);
    //     }
    //     socket?.on('get-users', (users) => {
    //         setOnlineUsers(users);
    //     });
        
    // }, [socket,currentUserId]);
    const [newMess, setNewMess] = useState<IMessage>({
        descrip: '',
        fromId: currentUserId,
        toId: userid,
        chatId: 0,
        createdAt: ''
    }) 
    console.log(userid);

    const createChatRoom = async () => {
        setLoading(true)
        let now = dayjs()
        let output = now.format('YYYY-MM-DD HH:mm:ss')
        try{
            const res = await axios.post('http://localhost:5000/api/v1/chatRoom/create',{
                members: [currentUserId, userid],
                createdAt: output
            })
            if(res.data.result === "New chatroom created successfully!"){
                setChatId(res.data.newResult[0]?.id!)
                setNewMess({...newMess, chatId: res.data.newResult[0].id})
                setFirst(false)
            } else{
                setFirst(true)
            }
        } catch(error){console.log(error)}
        finally{
            setLoading(false)
        }
    }
    useEffect(() => {
        const checkMemberExist = async () => {
            setLoading(true)
            try{
                const res = await axios.post('http://localhost:5000/api/v1/chatRoom/checkMessageExist',{
                    fromId: currentUserId,
                    toId: userid
                })
                console.log(res);
                if(res.data.result === "not found"){
                    setFirst(true)
                    // await createChatRoom()
                    // dispatch(getAllChatRooms)
                } else{
                    setFirst(false)
                    setChatId(res.data.result[0].id)
                }
            } catch(error){console.log(error)}
            finally{
                setLoading(false)
            }
        }   
        checkMemberExist()
    },[userid])
    const handleChange = (text: any) => {
        setText(text)
    }
    // const handleMessData = async() => {
    //     let now = dayjs()
    //     let output = now.format('YYYY-MM-DD HH:mm:ss')
    //     const newUpdate = { ...newMess, createdAt: output}
    //     try{
    //         const res = await axios.post(`http://localhost:5000/api/v1/chat/create`, newUpdate)
    //         if(res.status === 201){
    //             socket?.emit("send-message", res.data.result)
                
    //         }
    //     } catch(error){console.log(error)}
    //     setText('')
    //     setLoading(false)
    // }
    const sendMessage = async () => {
        setLoading(true)
        await createChatRoom()
        if(chatId){
        //     await handleMessData();
        //     onCloseMess()
        navigate(`/chat/${userid}`)
        }
    }   
    const handleRedirect = async() => {
        isFirst ?   await sendMessage()
                :   navigate(`/chat/${userid}`)
    }
    const validate = () => {
        return newMess.descrip.length === 0
    }
    useEffect(() => {
        validate()
    },[newMess.descrip])

    useEffect(() => {
        setNewMess({ ...newMess, descrip: text })
    },[text])
    return (
    <Modal closeOnOverlayClick={false} isCentered isOpen={isOpenMess} onClose={onCloseMess}>
        <ModalOverlay />
        <ModalContent maxW={500}>
        <ModalHeader textAlign='center'>Wait for checking conversation...</ModalHeader>
        <ModalCloseButton />
        <Box w='100%' h='1px' bgColor='gray.200' mb={2} ></Box>
        <ModalBody>
            {isFirst === false ? <Box>Your conversation with user:<Text fontWeight='bold'>{username}</Text> already exists, Please redirect to message box!</Box> : 
            <Flex>
                {/* <form onSubmit={handleRedirect} style={{display: 'flex', alignItems:'center', marginLeft:'auto', width: '100%'}}>
                    <InputEmoji placeholder='type a message'
                        value={text}
                        onChange={handleChange}
                    
                    />
                    <Button type='submit' isDisabled={validate()}>{loading ? <Box><Spinner />Sending...</Box> : 'Send'}</Button>
                </form> */}
                <Button onClick={sendMessage}>Create</Button>
            </Flex>
            }
        </ModalBody>
        {isFirst ? undefined :
        <ModalFooter>
            <Button 
                colorScheme='messenger' 
                onClick={handleRedirect} 
                rightIcon={<TbArrowNarrowRight fontSize={20}/>}
            >
                {loading ? <Box><Spinner />Loading...</Box> : 
                    <Box>Redirect</Box>
                }
            </Button>
        </ModalFooter>
         }
        
        </ModalContent>
    </Modal>
    )
}