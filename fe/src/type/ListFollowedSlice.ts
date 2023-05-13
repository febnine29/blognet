import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { IFollowed, IFollowersList } from "./common";
interface FollowState{
    followed: IFollowersList[] | null;
    followedLoading: boolean
}
export const getFollowed = createAsyncThunk("follow/getfollowed", async (followerUserId:number, { dispatch }) => {
  const response = await axios.post(`http://localhost:5000/api/v1/follow/getFollowed`,{
    id: followerUserId
  });
  return response.data.result;
});
const initialState: FollowState = {
    followed: null,
    followedLoading: false
};
export const FollowedSlice = createSlice({
    name: "followed",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      // Get All Task
      
      builder.addCase(getFollowed.pending, (state, action) => {
        state.followedLoading = true;
      });
      builder.addCase(getFollowed.fulfilled, (state, { payload }) => {
        state.followedLoading = false;
        state.followed = payload;
        console.log('followed:', payload)
      });
      builder.addCase(getFollowed.rejected, (state, action) => {
        state.followedLoading = false;
        state.followed = null;
      });
    },
  });
//   export const { setEditTask, setMess } = TaskSlice.actions;
  export const followedSelector = (state: RootState) => state.followed
  export default FollowedSlice.reducer;