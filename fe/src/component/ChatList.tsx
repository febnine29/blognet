import { Avatar, Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatListItem from "./ChatListItem";
import { AppDispatch } from "../app/store";
import { getAllChatRooms } from "../type/ChatRoomSlice";
import { chatRoomSelector } from "../type/ChatRoomSlice";
import { IMessage } from "../type/common";
interface IChatList{
    fromid: any;
    onSelectMessage: (id: number) => void;
    chat: any;
}
interface IResponse{
    id: number;
    members: number[];
    createdAt: string
}
export default function ChatList({fromid, onSelectMessage, chat}:IChatList){
    const dispatch = useDispatch<AppDispatch>()
    // const {chatRooms} = useSelector(chatRoomSelector)
    // const chatRoom = chatRooms?.find((room:any) => room.members.includes(fromid));
    const toid = chat?.members?.find((member:any) => member !== fromid)
    useEffect(() => {

    },[chat])
    const [lastMess, setLastMess] = useState<IMessage | null>(null)
    
        const fetchLastMessage = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/chat/getLatestMessage=${chat.id}`)
                if(res.data.result){
                    setLastMess(res.data.result)
                }
            } catch(error){console.log(error);
            }
        }
    useEffect(() => {
        fetchLastMessage()
    },[chat.id])
    const [ava, setAva] = useState<string>('')
    const [name, setName] = useState<string>('')
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${toid}`)
                setAva(response.data.info[0].profilePic)
                setName(response.data.info[0].name)
            } catch (error){ console.log(error); }
        }
        fetchUserInfo()
        
    },[toid])
    return(
        <Flex flexDirection='column'>
            <Flex w='100%' mb={4} p={3} _hover={{borderRadius: '10px', bgColor: 'gray.100'}}
                cursor="pointer"
            >
            <Flex>
                <Avatar 
                src={ava} name={name}
                 w='56px' h='56px'/>
            </Flex>
            <Flex w="100%" pl={4} flexDirection='column' justifyContent='center'>
                <Box textAlign='left' fontSize='18px'>
                    {name}
                </Box>  
                <Flex fontSize='14px' color='gray'>
                    {lastMess?.fromId === fromid ? 'You: ' : undefined}
                    <span style={{marginLeft: '5px'}}>{lastMess?.descrip}</span>
                </Flex>
            </Flex>
        </Flex>

    </Flex>
    )
}