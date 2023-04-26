import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { IComment, SingleComment } from "./common";
interface CommentState{
    comments: IComment[] | null;
    commentLoading: boolean
}
export const getCommentById = createAsyncThunk("comment/getAll", async (postId: number) => {
    const response = await axios.get(`http://localhost:5000/api/v1/comments/cmt=${postId}`);
    return response.data;
  });
export const getAllComments = createAsyncThunk("comment/getComments", async () => {
    const response = await axios.get('http://localhost:5000/api/v1/comments')
    return response.data
})
export const newComment = createAsyncThunk(
    "comment/new", 
    async ({descrip, postId, userId, createdAt, isLiked}:SingleComment, { dispatch }) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/v1/comments`,{
            descrip,
            postId,
            userId,
            createdAt,
            isLiked
        })
        dispatch(getAllComments())
    } catch (error) {
        console.log(error)
    }
})
const initialState: CommentState = {
    comments: null,
    commentLoading: false
};
export const CommentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      // Get All Task
      builder.addCase(getAllComments.pending, (state, action) => {
        state.commentLoading = true
      });
      builder.addCase(getAllComments.fulfilled, (state, { payload }) => {
        state.commentLoading = false
        state.comments = payload?.data;
        // console.log('comments:', payload.data)
      });
      builder.addCase(getAllComments.rejected, (state, action) => {
        state.commentLoading = false
        state.comments = null;
      });
      //Edit Task
    },
  });
//   export const { setEditTask, setMess } = TaskSlice.actions;
  export const commentSelector = (state: RootState) => state.comments;
  
  export default CommentSlice.reducer;