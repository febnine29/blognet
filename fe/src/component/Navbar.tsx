import React from 'react';
import { Box, Text, Avatar, Button, Menu,IconButton, MenuGroup, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
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
      <Box width='50%' bgColor='white' position='relative' borderRadius="50px" h="2rem" px={2}>
        <Text>search box</Text>
      </Box>
      {accessToken && accessToken !== 'undefined' ?
        <Box width='25%' display='flex' flexDirection='row' alignItems='center' justifyContent='flex-end'>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<Avatar name={user.name} src={user.avatar} marginRight=".5rem" size='sm'/>}
              _hover={{bgColor: 'transparent'}}
              _active={{bgColor: 'transparent'}}
              bgColor="transparent"
            />
            <MenuList style={{padding: '5px'}}>
              <MenuItem _hover={{ borderRadius: '5px'}}>
                <Icon as={BsFillPersonFill} fontSize={19} marginRight={2}/>Profile
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