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
import { BsFillPersonFill } from 'react-icons/bs'

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
      paddingX="30px"
      paddingY="1.5rem"
      backgroundColor="gray.100"
    >
      <Box fontSize='25px' maxWidth='100px' marginRight='auto'>
        <h1>Blog</h1>
      </Box>
      {accessToken && accessToken !== 'undefined' ?
        
        <Box maxWidth='200px' marginLeft='auto' display='flex' flexDirection='row' alignItems='center'>
          <Avatar name={user.name} src={user.avatar} marginRight=".5rem" />
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<FiMoreVertical size={20} />}
            />
            <MenuList style={{padding: '5px'}}>
              <MenuItem _hover={{ borderRadius: '5px'}}>
                <Icon as={BsFillPersonFill} fontSize={19} marginRight={2}/>Profile
              </MenuItem>
              <MenuItem onClick={handleLogout} _hover={{ borderRadius: '5px'}}>
                <Icon as={TbLogout} fontSize={20} marginRight={2}/>Log-out
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        :  
        <Box maxWidth='200px' marginLeft='auto' display='flex' flexDirection='row' alignItems='center'>
            <p>You need to <Link to='/login'><Text as='u'>Login</Text></Link></p>
        </Box> 
      }

    </Box>
  );
}