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
    <Box  p='20px' bg='white' borderRadius={10}>
        <Text fontSize='25px' fontWeight='bold'>Blog</Text>
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
        <Button type='submit' variant='solid' colorScheme='facebook' w='100px' mt={5}>Login</Button>
        </form>
        <Text color='gray.600' mt={10}>You don't have an account? <Link to='/register'><Text as='u'>Sign-Up</Text></Link></Text>
    </Box>
  );
};
export default LoginForm