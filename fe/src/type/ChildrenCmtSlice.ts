import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { IChildrenCmt, SingleChildrenCmt } from "./common";
interface CommentState{
    childrenCmt: IChildrenCmt[] | null;
    childrenLoading: boolean
}
export const getChildrenCmtById = createAsyncThunk("comment/getAll", async (postId: number) => {
    const response = await axios.get(`http://localhost:5000/api/v1/childrenCmt/cmt=${postId}`);
    return response.data;
  });
export const getAllChildrenCmt = createAsyncThunk("comment/getComments", async () => {
    const response = await axios.get('http://localhost:5000/api/v1/childrenCmt')
    return response.data
})
export const newChildrenCmt = createAsyncThunk(
    "commentChildren/new", 
    async ({descrip, postId, userId, createdAt}:SingleChildrenCmt, { dispatch }) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/v1/childrenCmt`,{
            descrip,
            postId,
            userId,
            createdAt
        })
        dispatch(getAllChildrenCmt())
    } catch (error) {
        console.log(error)
    }
})
const initialState: CommentState = {
    childrenCmt: null,
    childrenLoading: false
};
export const ChildrenCmtSlice = createSlice({
    name: "commentChildren",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      // Get All Task
      builder.addCase(getAllChildrenCmt.pending, (state, action) => {
        state.childrenLoading = true
      });
      builder.addCase(getAllChildrenCmt.fulfilled, (state, { payload }) => {
        state.childrenLoading = false
        state.childrenCmt = payload?.data;
        // console.log('comments:', payload.data)
      });
      builder.addCase(getAllChildrenCmt.rejected, (state, action) => {
        state.childrenLoading = false
        state.childrenCmt = null;
      });
      //Edit Task
    },
  });
//   export const { setEditTask, setMess } = TaskSlice.actions;
  export const childrenCmtSelector = (state: RootState) => state.childrenCmt;
  
  export default ChildrenCmtSlice.reducer;