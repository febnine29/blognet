import React,{useEffect, useState} from 'react';
import { Box, Flex, Avatar } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { postSelector } from '../type/PostSlice';
import { IComment } from '../type/common';
import axios from 'axios'
import dayjs from 'dayjs';
interface CommentProp{
    comments: IComment[] | null;
    userId: number;
    postId: number;
}
interface SingleComment{
    descrip: string;
    userId: number;
    postId: number;
    createdAt: string
}
export default function Comments({comments, userId, postId}: CommentProp){
    const {posts} = useSelector(postSelector)
    const now = dayjs()
    const timeCreate = now.format('YYYY-MM-DD HH:mm:ss')
    const [avaComment, setAva] = useState<string | null>('')
    const [comment, setComment] = useState<SingleComment>({
        descrip: '',
        userId: userId,
        postId: postId,
        createdAt: timeCreate
    })
    // fetch avatar for each comment
    useEffect(() => {
        const fetchAvaComment = async() => {
            try {
                await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${comment.userId}`)
                .then(response => {
                    setAva(response.data.infor.coverPic)
                })
            } catch(error) {
                console.log(error)
            }
        }
        fetchAvaComment();
    },[comment])
    return (
        <Flex className="comment-box" flexDirection='column' w="100%" borderTopWidth="1px" borderTopColor='gray.200' py={2}>
            <Flex></Flex>
            {comments?.map((comment) => (
                <Flex key={comment.id} textAlign='left' alignItems='center' mb={2}>
                    <Avatar className="" size="sm" mr={2}></Avatar>
                    <Box w='100%' px={2} py={1} borderRadius='10px' borderWidth='1px' borderColor='gray.100'>{comment.descrip}</Box>
                </Flex>
            ))}
        </Flex>
    )
}