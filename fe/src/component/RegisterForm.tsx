import React,{ useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import axios from 'axios'
interface RegisterProp{
    onSubmit: (
        username: string, 
        password: string, 
        email: string, 
        name: string,
        img: string
    ) => void;
}
export default function RegisterForm({onSubmit}: RegisterProp){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [img, setImg] = useState('')
    const [show, setShow] = React.useState(true)
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(username, password, email, name, img);
    };
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            console.log('formdata:',formData)
        }
    };
    return (
        <Box className='create-status new-classname' px={2} py={4} mb={4} bgColor='white' borderRadius='10px'>
            <form onSubmit={handleSubmit}>
                <label htmlFor="image-upload">Choose Image</label>
                <input id="image-upload" type="file" onChange={handleImageChange} />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <button type="submit">Register</button>
            </form>
            {img && <img src={img} alt="chosen" />}
            <Text>manhtran vinh university</Text>
        </Box>
    )
}