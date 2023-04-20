import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { IComment } from "./common";
interface CommentState{
    comments: IComment[] | null;
    commentLoading: boolean
}
export const getAllComments = createAsyncThunk("comment/getAll", async (postId: number) => {
    const response = await axios.get(`http://localhost:5000/api/v1/comments/cmt=${postId}`);
    return response.data;
  });

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
        state.comments = payload?.comment;
        // console.log('comments:', payload.comment)
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