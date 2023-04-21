import React from 'react';
import { Box,Flex, Text, Avatar, Button, Menu,IconButton, MenuGroup, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { storeAccessToken } from '../features/auth/AuthSlice';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';
import { TbLogout } from 'react-icons/tb';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { BsFillPersonFill } from 'react-icons/bs';
import "../css/navbar.css"

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken')
  const user = JSON.parse(localStorage.getItem('userInformation') || '{}');
  console.log(user);
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInformation');
    dispatch(storeAccessToken(''));
    navigate('/login');
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      paddingX={4}
      paddingY=".5rem"
      className="navbar"
      position='relative'
    >
      <Box fontSize='25px' fontWeight="bold" width='25%' color='white' display='flex' justifyContent='flex-start'>
        <Text>Invisocial</Text>
      </Box>
      <Box width='50%' bgColor='white' position='relative' borderRadius="50px" h="40px" px={1}>
        <Text>search box</Text>
      </Box>
      {accessToken && accessToken !== 'undefined' ?
        <Box width='25%' display='flex' flexDirection='row' alignItems='center' justifyContent='flex-end'>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<Avatar name={user[0].name} src={user.avatar} marginRight=".5rem" w='40px' h='40px'/>}
              _hover={{bgColor: 'transparent'}}
              _active={{bgColor: 'transparent'}}
              bgColor="transparent"
            />
            <MenuList style={{padding: '10px', width:'300px'}} >
              <MenuItem mb={2} display='flex' flexDirection='column' _hover={{ bgColor: 'transparent'}} borderRadius='10px' sx={{boxShadow: 'rgba(163, 163, 163, 0.5) 0px 0px 4px 0px;'}} bgColor='white'>
                <Flex w="100%" flexDirection='row' onClick={(e) => console.log('click')} alignItems='center' borderRadius='10px' _hover={{bgColor:'gray.100'}} pt={2} px={1} pb={3}>
                  <Avatar name={user[0].name} src={user.avatar} marginRight=".5rem" size='sm'/>
                  <Text fontWeight='bold' fontSize='17px'>{user[0].name}</Text>
                </Flex>
                <Box w="100%" h="1.5px" bgColor="gray.200" my={1}></Box>
                <Flex w="100%" _hover={{bgColor:'gray.100'}} p={2} justifyContent='center' alignItems='center' borderRadius='10px'>
                  <Text align='center' color='rgba(22, 0, 163, 0.7)' fontWeight='bold'>
                    See Profile
                  </Text>
                </Flex>
              </MenuItem>
              <MenuItem onClick={handleLogout} _hover={{ borderRadius: '5px'}} color="red">
                <Icon as={TbLogout} fontSize={20} marginRight={2}/>Log-out
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        :  
        <Box width='25%' display='flex' flexDirection='row' alignItems='center' justifyContent="flex-end">
            <Button 
              onClick={() => navigate("/login")} 
              bgColor="transparent"
              color="white"
              borderWidth="2px"
              borderColor="white"
              _hover={{color: "#6304c2", background: "white"}}
            >
              Login
            </Button>
        </Box> 
      }

    </Box>
  );
}