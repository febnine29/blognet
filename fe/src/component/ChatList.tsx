import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatListItem from "./ChatListItem";
import { AppDispatch } from "../app/store";
import { getAllChatRooms } from "../type/ChatRoomSlice";
import { chatRoomSelector } from "../type/ChatRoomSlice";
interface IChatList{
    fromid: any;
    onSelectMessage: (id: number) => void;
}
interface IResponse{
    id: number;
    members: number[];
    createdAt: string
}
export default function ChatList({fromid, onSelectMessage}:IChatList){
    const dispatch = useDispatch<AppDispatch>()
    const {chatRooms} = useSelector(chatRoomSelector)
    const chatRoom = chatRooms?.find(room => room.members.includes(fromid));
    useEffect(() => {
        console.log(chatRoom);
        // console.log(members);
        
    },[chatRooms])
    const handleSelectChatId = (id:number) => {
        onSelectMessage(id)
    }
    return(
        <Flex flexDirection='column'>
            <Box w='100%' textAlign='left' fontSize='30px' fontWeight='bold' mb={4}>Chats</Box>
            {chatRoom && (
                <ChatListItem 
                    toid={chatRoom.members.find(member => member !== fromid)}
                    onSelect={handleSelectChatId}
                    chatId={chatRoom?.id}
                />
            )}
    </Flex>
    )
}