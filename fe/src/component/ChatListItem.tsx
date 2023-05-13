import {useState, useEffect} from 'react'
import { Flex,Box, Avatar } from "@chakra-ui/react";
import axios from 'axios';
import { IMessage } from '../type/common';
interface IUser{
    profilePic: string;
    name: string;
    onSelect: (id: number) => void;
    lastMess: IMessage
}
export default function ChatListItem({toid, chatId, onSelect, lastMess}:any){
    // const [ava, setAva] = useState<IUser | null>(null)
    const [ava, setAva] = useState<string>('')
    const [name, setName] = useState<string>('')
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${toid}`)
                // console.log(response.data.info[0]);
                setAva(response.data.info.profilePic)
                
                setName(response.data.info.name)
            } catch (error){ console.log(error); }
        }
        fetchUserInfo()
        
    },[toid])
    const handleSelect = () => {
        onSelect(chatId)
    }
    return (
        <Flex w='100%' p={3} _hover={{borderRadius: '10px', bgColor: 'gray.100'}}
            cursor="pointer"
            onClick={handleSelect}
        >
            <Flex>
                <Avatar src={ava} name={name} w='56px' h='56px'/>
            </Flex>
            <Flex w="100%" pl={4} flexDirection='column' justifyContent='center'>
                <Box textAlign='left'>{name}</Box>  
                <Flex fontSize='14px' color='gray'>
                    {/* {lastMess?.descrip} */}
                    </Flex>
            </Flex>
        </Flex>
    )
}