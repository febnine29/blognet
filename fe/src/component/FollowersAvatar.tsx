import React, {useState, useEffect} from 'react'
import { Avatar, Flex } from "@chakra-ui/react";
import axios from 'axios';

export default function FollowersAvatar({follower}:any){
    const [username, setUsername] = React.useState<any>()
    const [ava, setAva] = React.useState<any>()
    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${follower.followerUserId}`);
            // if(response.data.info){
                setUsername(response.data.info?.name!);
                setAva(response.data.info?.profilePic!)
                // console.log(response.data.info);
            // }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchUser()
        console.log(follower);
        
    },[follower])
    return (
        <Avatar name={username} src={ava} size='sm' borderWidth={2} borderColor='white'/>
    )
}