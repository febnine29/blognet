import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

function Post() {
    const [images, setImages] = useState<any[]>([]);
    const [downloadUrl, setDownloadUrl] = useState<string[] | null>(null)
    const uploadFiles = async () => {
        for (let i = 0; i < images.length; i++) {
        const imageRef = ref(storage, `/image/${images[i].name}`);

        const result = await uploadBytes(imageRef, images[i])
        .then((e) => { 
            getDownloadURL(ref(storage, `${e.metadata.fullPath}`))
            .then((url) => {
                downloadUrl?.push(url)
            })
            console.log("success", e.metadata.fullPath); 
        })
        .catch((error) => { console.log("error"); });
        }
        console.log(downloadUrl);
        
    };

    console.log(images);

    return (
        <div className="App">
        <input
            type="file"
            multiple
            onChange={(event: any) => {
            setImages(event.target.files);
            }}
        />

        <button onClick={uploadFiles}>Submit</button>
        </div>
    );
}

export default Post;