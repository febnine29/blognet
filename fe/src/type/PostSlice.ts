import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { getAllPostsApi, ResponseGetPosts } from "./common";
import { IPost } from "./common";
interface TaskState{
    posts: IPost[] | null;
    postLoading: boolean
}
export const getAllPosts = createAsyncThunk("post/getAll", async () => {
    const response = await axios.get(getAllPostsApi);
  
    return response.data;
  });

const initialState: TaskState = {
    posts: null,
    postLoading: false
};
export const PostSlice = createSlice({
    name: "task",
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
        console.log('result:', payload?.data)
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