import React, {useState, useEffect, useRef} from 'react'
import { Avatar, Box, Flex, Text,Button, Input } from '@chakra-ui/react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import '../css/chatboxdetail.css'
import { AppDispatch } from '../app/store'
import { chatSelector, getChatData } from '../type/ChatSlice'
import { chatRoomSelector, getAllChatRooms } from '../type/ChatRoomSlice'
import { IMessage } from '../type/common'
import { newMessage } from '../type/ChatSlice'
import dayjs from 'dayjs'
import InputEmoji from 'react-input-emoji'

export default function ChatBoxDetail({chatid, fromid, senderId}:any){
    // const {fromid} = useParams()
    
    const dispatch = useDispatch<AppDispatch>()
    const [ava, setAva] = useState('')
    const [name, setName] = useState('')
    const [chatidd , setChatIdd] = useState<number>(chatid)
    const [receiveId, setToid] = useState<number>(senderId)
    const {chats} = useSelector(chatSelector)

    console.log(senderId, chatid);
    
    const [newMess, setNewMess] = useState<IMessage>({
        descrip: '',
        fromId: fromid,
        toId: senderId,
        chatId: chatidd,
        createdAt: ''
    }) 
    useEffect(() => {
        if(senderId){
            setNewMess({...newMess, toId: senderId})
        }
    },[senderId])
    const validate = () => {
        return newMess.descrip.length === 0
    }
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await  axios.get(`http://localhost:5000/api/v1/auth/getUserId=${newMess.toId}`)
                setAva(response.data.info[0]?.profilePic!)
                setName(response.data.info[0]?.name!)
            } catch (error){console.log(error);}
        }
        fetchUserInfo()
    }, [newMess.toId])
    const messageEnd = useRef<HTMLDivElement>(null);
    const [text, setText] = useState('')
    const handleChange = (text: any) => {
        setText(text)
    }
    const handleSubmitMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        dispatch(newMessage(newMess))
        setNewMess({ ...newMess, descrip: '' })
    }
    useEffect(() => {
        let now = dayjs()
        let output = now.format('YYYY-MM-DD HH:mm:ss')
        setNewMess({ ...newMess, createdAt: output, descrip: text })
        // setNewMess()
    },[dispatch])
    useEffect(()=> {
        messageEnd.current?.scrollIntoView({ behavior: "smooth" });
      },[chats])
    useEffect(() => {
        console.log('newmess:', newMess);
        validate()
    },[newMess.descrip])
    useEffect(() => {
        console.log(text);
        setNewMess({ ...newMess, descrip: text })
    },[text])
    return (
        <Flex flexDirection='column' w='100%' h='100%'>
            <Flex w='100%' h='80px' alignItems='center'>
                <Avatar src={ava} name={name}/>
                <Flex flexDirection='column' alignItems='flex-start' w='100%' pl={3} >
                    <Text fontWeight='bold' textAlign='left'>{name}</Text>
                    <Text fontSize='14px' color='gray'>inactive or not</Text>
                </Flex>
            </Flex>
            <Flex w='100%' h='100%' flexDirection='column' p={4}>
                {chats?.map((item) => (
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
            </Flex>
            <Flex w='100%' h='80px' px={4}>
                <form onSubmit={handleSubmitMessage} style={{display: 'flex', alignItems:'center', marginLeft:'auto', width: '100%'}}
                        >
                    <InputEmoji placeholder='type a message'
                        value={text}
                        onChange={handleChange}
                    />
                    <Button type='submit' isDisabled={validate()}>Send</Button>
                </form>
            </Flex>
        </Flex>
    )
}                                                            