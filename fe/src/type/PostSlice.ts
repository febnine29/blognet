import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { getAllPostsApi, ResponseGetPosts, ISinglePost } from "./common";
import { IPost } from "./common";
interface PostState{
    posts: IPost[] | null;
    postLoading: boolean
}
export const getAllPosts = createAsyncThunk("post/getAll", async () => {
    const response = await axios.get(getAllPostsApi);
  
    return response.data;
  });
  export const newPost = createAsyncThunk(
    "post/new", 
    async ({descrip, img, userId, createdAt, isLiked}:ISinglePost, { dispatch }) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/v1/posts/createPost`,{
            descrip,
            img, 
            userId, 
            createdAt, 
            isLiked
        })
        if(response.status === 201){
            dispatch(getAllPosts())
        }
        console.log('reponse new post:',response)
    } catch (error) {
        console.log(error)
    }
})
const initialState: PostState = {
    posts: null,
    postLoading: false
};
export const PostSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      // Get All Task
      builder.addCase(getAllPosts.pending, (state, action) => {
        state.postLoading = true
      });
      builder.addCase(getAllPosts.fulfilled, (state, { payload }) => {
        state.postLoading = false
        state.posts = payload?.data;
      });
      builder.addCase(getAllPosts.rejected, (state, action) => {
        state.postLoading = false
        state.posts = null;
      });
      //Edit Task
    },
  });
//   export const { setEditTask, setMess } = TaskSlice.actions;
  export const postSelector = (state: RootState) => state.posts;
  
  export default PostSlice.reducer;