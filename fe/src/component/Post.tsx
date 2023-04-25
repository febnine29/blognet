import React, {useEffect, useState, useRef} from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
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

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const flexRef = useRef<HTMLDivElement>(null);
    const onSelectFile = (event: any) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);

        const imagesArray = selectedFilesArray.map((file: any) => {
        return URL.createObjectURL(file);
        });
        setSelectedImages([...selectedImages, ...imagesArray])
        // FOR BUG IN CHROME
        event.target.value = "";
    };
    function deleteHandler(image: any) {
        setSelectedImages(selectedImages.filter((e) => e !== image));
        URL.revokeObjectURL(image);
    }
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (flexRef.current) {
              flexRef.current.scrollTop = flexRef.current.scrollHeight;
            }
          }, 1000);
        
          return () => clearTimeout(timeoutId);
    }, [selectedImages]);
    return (
        <Box>
            <Navbar />
            <Box>
                <label>
                + Add Images
                <br />
                <input
                    type="file"
                    name="images"
                    onChange={onSelectFile}
                    multiple
                    accept="image/png , image/jpeg, image/webp"
                />
                </label>
                <br />

            <Flex ref={flexRef} flexDirection='column' className="images" maxW={300} maxH={400} overflowY={selectedImages ? 'scroll' : 'unset'} >
                {selectedImages &&
                selectedImages.reverse().map((image, index) => {
                    return (
                    <Box key={image} className="image">
                        <img src={image} width='300' height="auto" alt="upload" />
                        <Button onClick={() => deleteHandler(image)}>
                            delete image
                        </Button>
                    </Box>
                    );
                })}
            </Flex>
            </Box>
        </Box>
    )
}