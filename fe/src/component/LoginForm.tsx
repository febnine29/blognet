import React,{ useState } from 'react';
import { Box, 
    FormControl,
    FormLabel,
    Button,
    FormErrorMessage,
    Input,
    FormHelperText, 
    InputGroup,
    InputRightElement,
    Text
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = React.useState(true)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(username, password);
  };

  return (
    <Box className='auth-form' display='flex' flexDirection='row' borderRadius='10px' w='70%' h='auto'>
        <Box className='inner-left' p='40px' width='55%' bgColor='lightgray' textAlign='left' borderRadius='10px 0px 0px 10px'>
          <Text fontSize='5xl'>Invisocial.</Text>
          <Text>an social app for student</Text>
        </Box>
        <Box className='inner-right' p='2rem' bg='white' width='45%' textAlign='left' borderRadius='0px 10px 10px 0px'>
        <Text fontSize='25px' fontWeight='bold' mb={5} color='#6304c2'>Login</Text>
        <form onSubmit={handleSubmit}>
        <FormLabel>Username</FormLabel>
        <Input variant='filled' placeholder='Input your username'
            onChange={(e) => setUsername(e.target.value)}
        />
        <FormLabel marginTop='10px'>Password</FormLabel>
        <InputGroup size='md'>
        <Input
            pr='4.5rem'
            type={show ? 'password' : 'text'}
            placeholder='Enter password'
            variant='filled'
            onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
            {show ? 'Show' : 'Hide'}
            </Button>
        </InputRightElement>
        </InputGroup>
        <Button type='submit' variant='solid' bgColor='#6304c2' color='white' w='100px' mt={5}
          _hover={{color: '#6304c2', background: 'white', borderWidth: '2px', borderColor: '#6304c2'}}
        >
          Login
        </Button>
        </form>
        <Text color='gray.600' mt={10}>You don't have an account? <Link to='/register'><Text as='u'>Sign-Up</Text></Link></Text>
        </Box>
    </Box>
    
  );
};
export default LoginForm