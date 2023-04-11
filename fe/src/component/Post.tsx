import React from 'react';
import { Box } from '@chakra-ui/react';
import axios from 'axios';
import { getAllPostsApi } from '../type/common';
import Navbar from './Navbar';
export default function Post(){
    const [loading, setLoading] = React.useState(false) // initialize loading state to false

    React.useEffect(() => {
        setLoading(true) // set loading to true when component first renders
        axios.get(getAllPostsApi)
          .then(res => console.log('res:', res.data))
          .catch(err => console.log(err))
          .finally(() => setLoading(false))
      }, []) 
      console.log('loading:', loading)
    return (
        <Box>
            <Navbar />
            {loading && 'testing'}
        </Box>
    )
}