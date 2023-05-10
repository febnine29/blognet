
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
export default function ShowMessages({ ava, name, messageEnd, fromid, allChats}:any){
    const {chats} = useSelector(chatSelector)
    const [firstLoad, setFirstLoad] = useState(true);
    useEffect(()=> {
        if (firstLoad) {
            messageEnd.current?.scrollIntoView();
            setFirstLoad(false);
        } else {
            messageEnd.current?.scrollIntoView({ behavior: "smooth" });
        }
    },[chats])
    return (
       <Flex w='100%' h='100%' flexDirection='column' p={4} className="display-messages" >
            {chats?.map((item:any) => (
            <Flex key={item.id} w='100%' 
                mb={2}
                alignItems='flex-end'
            >
                <Avatar src={ava} name={name} display={item.fromId === fromid ? 'none' : 'block'} size='sm' mr={2}/>
                <Box display='inline-block' className={item.fromId === fromid ? 'your-message' : 'other-message'}>
                    {item.descrip}
                </Box>
            </Flex>
            ))}
            <Box ref={messageEnd}></Box>
        </Flex>
    )
}