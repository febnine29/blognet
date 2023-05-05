import React, { useState, useEffect, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Flex, Box, Button, Text, Input } from "@chakra-ui/react"
import { storage } from "../firebase";
import { useParams, useLocation } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { io,Socket } from "socket.io-client";
import Navbar from "../component/Navbar";
import axios from 'axios'
import dayjs from 'dayjs'
import ChatList from "../component/ChatList";
import ChatBoxDetail from "../component/ChatBoxDetail";
interface IMessage{
    descrip: string;
    fromId: number;
    toId: number;
    createdAt: string;
}
interface IChatList{
    fromId: number;
    toId: number
}
function Chat() {
    const {fromid} = useParams()
    const user = JSON.parse(localStorage.getItem('userInformation') || '{}');
    const [chatList, setChatList] = useState<IChatList[] | null>(null)
    const [selectedToid, setSelectedToid] = useState<number | null>(null)
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [text, setText] = useState<IMessage>({
        descrip: '',
        fromId: user[0].id,
        toId: 0,
        createdAt: ''
    })
    useEffect(() => {
        const fetchChatList = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/chat/getChatList=${fromid}`)
                setChatList(response.data)
            } catch(error) {console.log(error)};
        }
        fetchChatList()
    },[])
    const userid = user[0].id
    useEffect(() => {
        if (!socket) {
            const newSocket = io('http://localhost:8800');
            setSocket(newSocket);
            newSocket.emit("new-user-add", userid);
        }
        socket?.on('get-users', (users) => {
            setOnlineUsers(users);
        });
        
    }, [socket,user]);
    // send message to socket server
    const [receiveMessage, setReceiveMessage] = useState<IMessage | null>(null)
    useEffect(() => {
        socket?.on("receive-message", (data) => {
            setReceiveMessage(data)
            console.log(data);
            console.log('running');
            
        })
    },[socket, receiveMessage])

    useEffect(() => {
        // console.log(chatList);
    },[])
    const handleSubmit = async () => {
        let now = dayjs()
        let output = now.format('YYYY-MM-DD HH:mm:ss')
        await new Promise<void>((resolve) => {
            setText({ ...text, createdAt: output })
            resolve();
        });
        socket?.emit('send-message', text)
    }
    const handleSelectToid = (id:number) => {
        setSelectedToid(id);
    }
    useEffect(() => {
        // console.log(receiveMessage)
    },[receiveMessage])
    // useEffect(() => {
        
    //     console.log(onlineUsers);
    // },[onlineUsers])
    return (
        <Box className="chat">
            <Navbar />
            <Flex className="chat-detail" w='100%' h='min(100vh - 56px)' p={2} bgColor="#f7f7f7" justifyContent='space-between'>
                <Flex className="chat-list" flexDirection='column' w='35%' bgColor="white" borderRadius='10px' p={4}>
                    <ChatList fromid={user[0].id!} onSelectMessage={handleSelectToid}/>
                </Flex>
                <Flex className='chat-box' w='64%' h='100%' flexDirection='column' bgColor="white" borderRadius='10px' p={4}>
                    <ChatBoxDetail toid={selectedToid} fromid={user[0].id!}/>
                </Flex>
            </Flex>
        </Box>
    );
}

export default Chat;