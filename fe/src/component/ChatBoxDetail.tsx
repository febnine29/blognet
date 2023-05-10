import React, {useState, useEffect, useRef} from 'react'
import { Avatar, Box, Flex, Text,Button, Input } from '@chakra-ui/react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import '../css/chatboxdetail.css'
import { AppDispatch } from '../app/store'
import { chatSelector, getChatData } from '../type/ChatSlice'
import { chatRoomSelector, getAllChatRooms } from '../type/ChatRoomSlice'
import { IChat, IMessage } from '../type/common'
import { newMessage } from '../type/ChatSlice'
import { io,Socket } from "socket.io-client";
import dayjs from 'dayjs'
import InputEmoji from 'react-input-emoji'
import ShowMessages from './ShowMessages'

export default function ChatBoxDetail({chatid, fromid, senderId, chat}:any){
    const dispatch = useDispatch<AppDispatch>()
    const [ava, setAva] = useState('')
    const [name, setName] = useState('')
    const [chatidd , setChatIdd] = useState<number>(chatid)
    const [receiveId, setToid] = useState<number>(senderId)
    const [allChats, setAllChats] = useState<IChat[]>([])
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const toid = chat?.members?.find((mem:any) => mem !== fromid)
    
    useEffect(() => {
        if (!socket) {
            const newSocket = io('http://localhost:8800');
            setSocket(newSocket);
            newSocket.emit("new-user-add", fromid);
        }
        socket?.on('get-users', (users) => {
            setOnlineUsers(users);
        });
        
    }, [socket,fromid]);
    // console.log(senderId, chatid);
    
    const [newMess, setNewMess] = useState<IMessage>({
        descrip: '',
        fromId: fromid,
        toId: toid,
        chatId: chat.id,
        createdAt: ''
    }) 
    useEffect(() => {
        console.log('toid', toid);
    },[toid])
    useEffect(() => {
        if(senderId){
            setNewMess({...newMess, toId: senderId})
        }
    },[senderId])
    const validate = () => {
        return newMess.descrip.length === 0
    }
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await  axios.get(`http://localhost:5000/api/v1/auth/getUserId=${toid}`)
                setAva(response.data.info[0]?.profilePic!)
                setName(response.data.info[0]?.name!)
            } catch (error){console.log(error);}
        }
        fetchUserInfo()
    }, [toid])
    const messageEnd = useRef<HTMLDivElement>(null);
    const [text, setText] = useState('')
    const handleChange = (text: any) => {
        setText(text)
    }
    const handleSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // dispatch(newMessage(newMess))
        let now = dayjs()
        let output = now.format('YYYY-MM-DD HH:mm:ss')
        const newUpdate = { ...newMess, createdAt: output}
        console.log('newMess', newMess);
        try{
            const res = await axios.post(`http://localhost:5000/api/v1/chat/create`, newUpdate)
            if(res.status === 201){
                // setAllChats([...allChats, res.data.result])
                socket?.emit("send-message", res.data.result)
            }
        } catch(error){console.log(error)}
        setText('')
    }

    useEffect(() => {
        validate()
    },[newMess.descrip])

    useEffect(() => {
        setNewMess({ ...newMess, descrip: text })
    },[text])
    useEffect(() => {
        socket?.on("receive-message", (data) => {
            if(data.chatId === chat.id){
                dispatch(getChatData(chat.id))
            }
        })
    },[socket])

    return (
        <Flex flexDirection='column' w='100%' h='100%'>
            <Flex w='100%' h='80px' alignItems='center' className='username-chat'>
                <Avatar src={ava} name={name}/>
                <Flex flexDirection='column' alignItems='flex-start' w='100%' pl={3} >
                    <Text fontSize='18px' fontWeight='bold' textAlign='left'>{name}</Text>
                    <Text fontSize='14px' color='gray'>inactive or not</Text>
                </Flex>
            </Flex>
            <ShowMessages allChats={allChats} ava={ava} name={name} messageEnd={messageEnd} fromid={fromid}/>
            <Flex w='100%' h='80px' px={4}>
                <form onSubmit={handleSubmitMessage} style={{display: 'flex', alignItems:'center', marginLeft:'auto', width: '100%'}}>
                    <InputEmoji placeholder='type a message'
                        value={text}
                        onChange={handleChange}
                    
                    />
                    <Button type='submit' isDisabled={validate()}>Send</Button>
                </form>
            </Flex>
        </Flex>
    )
}                                                            