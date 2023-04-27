import React, { useState, useEffect, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Flex, Box, Button, Text } from "@chakra-ui/react"
import { storage } from "../firebase";
import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { io,Socket } from "socket.io-client";
interface IMessage{
    descrip: string;
    fromId: number;
    toId: number;
    createdAt: string;
    chatId: string;
}
function Post() {
    const user = JSON.parse(localStorage.getItem('userInformation') || '{}');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const userid = user[0].id
    useEffect(() => {
        if (!socket) {
            const newSocket = io('http://localhost:8800');
            setSocket(newSocket);
            newSocket.emit("new-user-add", userid);
            // newSocket.on('get-users', (users) => {
            //     setOnlineUsers(users);
            // }); 
        }
        socket?.on('get-users', (users) => {
            setOnlineUsers(users);
        });
        
    }, [socket,user]);
    // send message to socket server
    const sendMessage = () => {
        const message = {
            descrip: 'mlem123',
            fromId: 1,
            toId: 2,
            createdAt: '123',
            chatId: '10'
        }
        socket?.emit('send-message', message)

    }
    const [receiveMessage, setReceiveMessage] = useState<IMessage | null>(null)
    useEffect(() => {
        socket?.on("receive-message", (data) => {
            setReceiveMessage(data)
            console.log(data);
            
        })
    },[socket, receiveMessage])
    useEffect(() => {
    console.log(receiveMessage);

    },[receiveMessage])
    
    return (
        <Box className="Post">
            <Box>
                <Button onClick={sendMessage}>send</Button>
            </Box>
        </Box>
    );
}

export default Post;