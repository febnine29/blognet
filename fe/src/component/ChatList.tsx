import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useState,useEffect } from "react";
import ChatListItem from "./ChatListItem";
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
    // const [chatList, setChatList] = useState<IResponse[] | null>(null)
    const [chatRooms, setchatRooms] = useState<IResponse[] | null>(null)
    const fetchChatlist = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/chatRoom/getAllChatRooms`)
            // const membersArray = response.data.result.map((item: any) => item.members);
            setchatRooms(response.data.result)
        }   
         catch (error) { console.log(error); }
    }
    // const members = chatRooms?.map((item: any) => item.members);
    // const currentChatRoom = members?.find((id:any) => id === fromid)
    const chatRoom = chatRooms?.find(room => room.members.includes(fromid));
    useEffect(() => {
        fetchChatlist()
    },[])
    useEffect(() => {
        console.log(chatRoom);
        // console.log(members);
        
    },[chatRooms])
    const handleSelectToid = (id:number) => {
        onSelectMessage(id)
    }
    return(
        <Flex flexDirection='column'>
            <Box w='100%' textAlign='left' fontSize='30px' fontWeight='bold' mb={4}>Chats</Box>
            {chatRoom && (
                <ChatListItem 
                    toid={chatRoom.members.find(member => member !== fromid)}
                    onSelect={handleSelectToid}
                    chatId={chatRoom?.id}
                />
            )}
    </Flex>
    )
}