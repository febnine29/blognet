import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { IChat, IChatRoom, IMessage } from "./common";
interface ChatState{
    chatRooms: IChatRoom[] | null;
    chatRoomLoading: boolean
}
export const getAllChatRooms = createAsyncThunk("chatRoom/getAllChatRooms", async () => {
  const response = await axios.get("http://localhost:5000/api/v1/chatRoom/getAllChatRooms");
  return response.data.result;
});
const initialState: ChatState = {
    chatRooms: null,
    chatRoomLoading: false
};
export const ChatRoomSlice = createSlice({
    name: "chatRoom",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      // Get All Task
      
      builder.addCase(getAllChatRooms.pending, (state, action) => {
        state.chatRoomLoading = true;
      });
      builder.addCase(getAllChatRooms.fulfilled, (state, { payload }) => {
        state.chatRoomLoading = false;
        state.chatRooms = payload;
        console.log('chatRooms:', payload)
      });
      builder.addCase(getAllChatRooms.rejected, (state, action) => {
        state.chatRoomLoading = false;
        state.chatRooms = null;
      });
    },
  });
//   export const { setEditTask, setMess } = TaskSlice.actions;
  export const chatRoomSelector = (state: RootState) => state.chatRooms
  export default ChatRoomSlice.reducer;