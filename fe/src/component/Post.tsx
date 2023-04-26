import React, { useState, useEffect, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Flex, Box, Button } from "@chakra-ui/react"
import { storage } from "../firebase";

function Post() {
    const [images, setImages] = useState<any[]>([]);
    const [downloadUrl, setDownloadUrl] = useState<string[]>([])
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const flexRef = useRef<HTMLDivElement>(null);

    const uploadFiles = async () => {
        for (let i = 0; i < images.length; i++) {
        const imageRef = ref(storage, `/image/${images[i].name}`);

        const result = await uploadBytes(imageRef, images[i])
        .then((e) => { 
            getDownloadURL(ref(storage, `${e.metadata.fullPath}`))
            .then((url) => {
                downloadUrl.push(url)
            })
            console.log("success", e.metadata.fullPath); 
        })
        .catch((error) => { console.log("error"); });
        }
        console.log(downloadUrl);
        
    };
    const handleSelected = (event: any) => {
        setImages(event.target.files);
        onSelectFile(event)
    }
    console.log(images);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (flexRef.current) {
              flexRef.current.scrollTop = flexRef.current.scrollHeight;
            }
          }, 700);
        
          return () => clearTimeout(timeoutId);
    }, [selectedImages]);
    const onSelectFile = (event: any) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
  
        const imagesArray = selectedFilesArray.map((file: any) => {
            return URL.createObjectURL(file);
        });
        setSelectedImages([...selectedImages, ...imagesArray])
        // FOR BUG IN CHROME
        // event.target.value = "";
    };
    function deleteHandler(image: any) {
        setSelectedImages(selectedImages.filter((e) => e !== image));
        URL.revokeObjectURL(image);
    }

    return (
        <div className="App">
        <input
            type="file"
            multiple
            onChange={handleSelected}
        />
        <p>{`${selectedImages.length} selected `}</p>
        <button onClick={uploadFiles}>Submit</button>
        <button onClick={() => setDownloadUrl([])}>clear</button>
         <Flex ref={flexRef} flexDirection='column' className="images" maxW={300} maxH={400} overflowY={selectedImages ? 'scroll' : 'unset'} >
            {selectedImages &&
            selectedImages.reverse().map((image, index) => {
                return (
                <Box key={image} className="image">
                    <img src={image} width='300' height="auto" alt="upload" />
                    {/* <Progress value={progressUpload} /> */}
                    <Button onClick={() => deleteHandler(image)}>
                        delete image
                    </Button>
                </Box>
                );
            })}
        </Flex>
        </div>
    );
}

export default Post;