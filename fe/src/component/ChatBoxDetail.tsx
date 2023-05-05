import React, {useState, useEffect} from 'react'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import { useParams } from 'react-router'
import axios from 'axios'

interface IChatData{
    id: number;
    chatId: number;
    fromId: number;
    toId: number;
    createdAt: string
    descrip: string
}
export default function ChatBoxDetail({toid, fromid, chatId}:any){
    // const {fromid} = useParams()
    const [ava, setAva] = useState('')
    const [name, setName] = useState('')
    const [chatData, setChatData] = useState<IChatData[] | null>(null)
    console.log(fromid, toid)
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await  axios.get(`http://localhost:5000/api/v1/auth/getUserId=${toid}`)
                setAva(response.data.info[0].profilePic)
                setName(response.data.info[0].name)
            } catch (error){console.log(error);}
        }
        fetchUserInfo()
    }, [toid])
    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const response = await  axios.get(`http://localhost:5000/api/v1/chat/getConversation=${chatId}`)
                setChatData(response.data.result)
            } catch (error){console.log(error);}
        }
        fetchConversation()
    }, [chatId])

    if(toid === null){
        return <Box>Select a user to start chating!</Box>
    }
    console.log(chatData);
    
    return (
        <Flex flexDirection='column' w='100%' h='100%'>
            <Flex bgColor='cyan' w='100%' h='80px' alignItems='center'>
                <Avatar src={ava} name={name}/>
                <Flex flexDirection='column' alignItems='flex-start' w='100%' pl={3} >
                    <Text fontWeight='bold' textAlign='left'>{name}</Text>
                    <Text fontSize='14px' color='gray'>inactive or not</Text>
                </Flex>
            </Flex>
            <Flex bgColor='orange' w='100%' h='100%' flexDirection='column'>
                {chatData?.map((item) => (
                <Flex key={item.id} >
                    {item.descrip}
                </Flex>
                ))}
            </Flex>
            <Flex bgColor='green' w='100%' h='70px'>
                
            </Flex>
        </Flex>
    )
}                                                            