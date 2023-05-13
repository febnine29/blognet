import React, {useState, useEffect} from 'react'
import { Avatar, Flex, Icon, Text, Box } from "@chakra-ui/react";
import { GiLaurelsTrophy, GiTrophy, GiTrophyCup } from "react-icons/gi";
import axios from 'axios';
import { BsPeopleFill, BsTrophyFill } from 'react-icons/bs';
import { FaTrophy } from 'react-icons/fa';
import { useNavigate } from 'react-router';

export default function UserSearch({user}:any){
    const navigate = useNavigate()
    const [username, setUsername] = React.useState<any>()
    const [ava, setAva] = React.useState<any>()
    const [followers, setFollowers] = useState()
    useEffect(() => {
        const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${user.id}`);
            // if(response.data.info){
                setUsername(response.data.info.name);
                setAva(response.data.info.profilePic)
                // console.log(response.data.info);
            // }
        } catch (error) {
            console.error(error);
            }
        };
        const countFollowers = async () => {
            try {
                const res = await axios.post('http://localhost:5000/api/v1/follow/getFollowers',{
                    id: user.id
                })
                setFollowers(res.data.result.length)
            } catch(error){console.log(error)}
        }
        countFollowers();
        fetchUser();
    }, [user]);
    return (
        <Flex alignItems='center'  mb={4} w="100%">
            <Flex w='50px' justifyItems='center' alignItems='center'>
            {/* <Icon 
                as={index === 0 ? GiTrophyCup : index === 1 ? FaTrophy : index === 2 ? FaTrophy : index} 
                // fontSize={index === 0 ? 40 : index === 1 ? 30 : index === 2 ? 30 : index}
                fontSize={35} 
                color={index === 0 ? "goldenrod" : index === 1 ? 'silver' : index === 2 ? 'bronze' : index}  
                mr={4}
            /> */}
            </Flex>
            <Flex>
                <Avatar name={username} src={ava}/>
                <Flex flexDirection='column' ml={2}>
                    <Text 
                        fontWeight='bold' textAlign='left' fontSize='17px' color="gray.600"
                        onClick={() => navigate(`/profileId/${user.id}`)}
                        _hover={{cursor: 'pointer', textDecoration: 'underline'}}
                    > 
                        {username}
                    </Text>
                    <Flex alignItems='center' color="gray.600">
                        <Icon as={BsPeopleFill} color='purple.800' mr={1}/>
                        <Text textAlign='left' fontSize='13px'>{followers! > 1 ? `${followers} Followers` : `${followers} Follower`}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}