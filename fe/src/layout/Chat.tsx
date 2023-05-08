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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { chatRoomSelector, getAllChatRooms } from "../type/ChatRoomSlice";
import { getChatData } from "../type/ChatSlice";
import { log } from "console";
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
    const dispatch = useDispatch<AppDispatch>()
    const {fromid} = useParams()
    const user = JSON.parse(localStorage.getItem('userInformation') || '{}');
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    

    const userid = user[0]?.id!

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
    const handleSelectChatId = (id:number) => {
        setSelectedChatId(id);
    }
    useEffect(() => {
        // console.log(receiveMessage)
    },[receiveMessage])
    const [senderId, setSenderId] = useState<number>(0)
    const fetchMembers = async (id:number) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/chatRoom/getChatRoomId=${id}`)
            if(res.data.result[0]?.members?.length !== 0){
                const member = res.data.result[0]?.members?.find((mem:any) => mem !== userid);
                setSenderId(member)
            }
        } catch(error){console.log(error)}
    }
    useEffect(() => {
        dispatch(getAllChatRooms())
        if(selectedChatId){
            dispatch(getChatData(selectedChatId))
            fetchMembers(selectedChatId)
        }
    },[selectedChatId])
    
    console.log('member: ', senderId);
    return (
        <Box className="chat">
            <Navbar />
            <Flex className="chat-detail" w='100%' h='min(100vh - 56px)' p={2} bgColor="#f7f7f7" justifyContent='space-between'>
                <Flex className="chat-list" flexDirection='column' w='35%' bgColor="white" borderRadius='10px' p={4}>
                    <ChatList fromid={user[0].id!} onSelectMessage={handleSelectChatId}/>
                </Flex>
                <Flex className='chat-box' w='64%' h='100%' flexDirection='column' bgColor="white" borderRadius='10px' p={4}>
                    {selectedChatId ? 
                        <ChatBoxDetail chatid={selectedChatId} fromid={user[0].id!} senderId={senderId}/>
                    : <Box>Select a user to direct</Box>}
                    
                </Flex>
            </Flex>
        </Box>
    );
}

export default Chat;