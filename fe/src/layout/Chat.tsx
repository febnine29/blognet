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
import ChatListItem from "../component/ChatListItem";
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
    useEffect(() => {
        const fetchChatList = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/chat/getChatList=${fromid}`)
                setChatList(response.data)
            } catch(error) {console.log(error)};
        }
        fetchChatList()
    },[])
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [text, setText] = useState<IMessage>({
        descrip: '',
        fromId: user[0].id,
        toId: 0,
        createdAt: '2023-04-28 09:00:00'
    })
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
        console.log(chatList);
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

    useEffect(() => {
        console.log(receiveMessage)
    },[receiveMessage])
    useEffect(() => {
        
        console.log(onlineUsers);
    },[onlineUsers])
    return (
        <Box className="Chat" h='100%'>
            <Navbar />
            <Flex w='100%' >
                <Flex className="chat-list" flexDirection='column' w='35%' h="100%" bgColor="gray.300">
                    <ChatListItem />
                </Flex>
                <Flex className='chat-box' w='65%' flexDirection='column'>
                    <Flex className="show-messages">

                    </Flex>
                    <Flex className="input-message">
                        <form onSubmit={handleSubmit}>
                            <Input placeholder="text" onChange={(e) => setText({...text, descrip: e.target.value})}/>
                            
                        </form>
                        <Button type="submit">send</Button>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
}

export default Chat;