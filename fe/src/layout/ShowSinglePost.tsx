import { Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import Navbar from "../component/Navbar";
import ShowPostItem from "../component/ShowPostItem";
import SinglePost from "../component/SinglePost";
import { postSelector } from "../type/PostSlice";

export default function ShowSinglePost(){
    const { postid } = useParams()
    const {posts} = useSelector(postSelector)
    const singlePost = posts?.find(post => post.id === parseInt(postid!))
    return(
        // {singlePost && 
        <Flex flexDirection='column'>
            <Navbar />
            <Flex w='100%' justifyContent='center' pt={4}>
                <ShowPostItem  
                    postId={singlePost?.id!}
                    descrip={singlePost?.descrip!} 
                    img={singlePost?.img!} 
                    userId={singlePost?.userId!} 
                    createdAt={singlePost?.createdAt!}
                    isLiked={singlePost?.isLiked!}
                />
            </Flex>
        </Flex>
    )
}