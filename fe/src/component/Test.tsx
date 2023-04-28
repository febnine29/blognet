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
    chatId: number;
}
function Test() {
    const user = JSON.parse(localStorage.getItem('userInformation') || '{}');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
    const [test, setText] = useState<IMessage>({
        descrip: '',
        fromId: user[0].id,
        toId: 0,
        createdAt: '2023-04-28 09:00:00',
        chatId: 11
    })
    const userid = user[0].id
    // const socket = io('http://localhost:8800')
    useEffect(() => {
        if (!socket) {
            const newSocket = io('http://localhost:8800');
            setSocket(newSocket);
            newSocket.emit("new-user-add", userid);
            // socket.emit("new-user-add", userid);
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
        // const message = 'test message'
        socket?.emit('send-message', message)

    }
    const [receiveMessage, setReceiveMessage] = useState<IMessage | null>(null)
    // const [receiveMessage, setReceiveMessage] = useState('')
    useEffect(() => {
        socket?.on("receive-message", (data) => {
            setReceiveMessage(data)
            console.log(data);
            console.log('running');
            
        })
    },[socket, receiveMessage])
    useEffect(() => {
    console.log(receiveMessage);

    },[receiveMessage])
    useEffect(() => {
        console.log(onlineUsers);
    },[onlineUsers])
    
    return (
        <Box className="Post">
            <Box>
                <Button onClick={sendMessage}>send</Button>
            </Box>
        </Box>
    );
}

export default Test;