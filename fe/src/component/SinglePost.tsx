import React from 'react';
import { Box, Flex, Avatar, Text } from '@chakra-ui/react'
import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime'
interface SinglePostProp{
    key: number;
    userId: number;
    img: string;
    descrip: string;
    createdAt: string
}
// dayjs.extend(utc);
// dayjs.extend(timezone);
dayjs.extend(relativeTime)
export default function SinglePost({key, descrip, userId, img, createdAt}: SinglePostProp){
    const date = dayjs('2023-16-04').fromNow()

    console.log(date);
    return (
        <Box className='shadow-box' px={2} py={4} mb={4} bgColor='white' borderRadius='10px'>
            <Flex className='post-info' alignItems='center'>
                <Avatar size='sm' src={img} />
                <Box ml={2}>
                    <Text fontWeight='bold'>{userId}</Text>
                    <Text fontSize='sm'>{dayjs(createdAt).format("DD/MM/YYYY")}</Text>
                </Box>
            </Flex>
            <Box className='description'>{descrip}</Box>
            <Box className='react-buttons'>

            </Box>
        </Box>
    )
}   