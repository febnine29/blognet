import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
export interface IUser{
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
export const getUserInfo = createAsyncThunk("user/GetUserInfo", async (userid: any) => {
  const response = await axios.get(`http://localhost:5000/api/v1/auth/getUserId=${userid}`)
  return response.data.info
})

const initialState: UserState = {
  user: null,
  userLoading: false
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.pending, (state, action) => {
      state.userLoading = true
    });
    builder.addCase(getUserInfo.fulfilled, (state, { payload }) => {
      state.userLoading = false
      state.user = payload;
    });
    builder.addCase(getUserInfo.rejected, (state, action) => {
      state.userLoading = false
      state.user = null;
    });
  },
});

export const userSelector = (state: RootState) => state.user;

export default UserSlice.reducer;