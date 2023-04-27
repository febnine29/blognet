import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
interface IUser{
    id: number;
    username: string;
    email: string | null;
    name: string;
    coverPic: string | null;
    profilePic: string | null;
    city: string | null;
    website: string | null
}
interface UserState{
    user: IUser | null;
    userLoading: boolean
}
export const getUserById= createAsyncThunk("user/getById", async (id:number) => {
    const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${id}`);
  
    return response.data.infor;
  });
const initialState: UserState = {
    user: null,
    userLoading: false
};
export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      // Get All Task
      builder.addCase(getUserById.pending, (state, action) => {
        state.userLoading = true
      });
      builder.addCase(getUserById.fulfilled, (state, { payload }) => {
        state.userLoading = false
        state.user = payload?.data;
        console.log(payload);
        
      });
      builder.addCase(getUserById.rejected, (state, action) => {
        state.userLoading = false
        state.user = null;
      });
      //Edit Task
    },
  });
//   export const { setEditTask, setMess } = TaskSlice.actions;
  export const userSelector = (state: RootState) => state.user;
  
  export default UserSlice.reducer;