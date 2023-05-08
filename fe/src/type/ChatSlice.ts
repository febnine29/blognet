import { RootState } from "../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import { IChat, IChatRoom, IMessage } from "./common";
interface ChatState{
    chats: IChat[] | null;
    chatLoading: boolean
}
export const getChatData = createAsyncThunk("chat/getChatData", async (chatId: any) => {
    const response = await axios.get(`http://localhost:5000/api/v1/chat/getConversation=${chatId}`)
    return response.data.result
})
export const newMessage = createAsyncThunk(
    "chat/new", 
    async ({descrip, fromId, toId, createdAt, chatId}:IMessage, { dispatch }) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/v1/chat/create`,{
            descrip,
            fromId,
            toId,
            chatId,
            createdAt
        })
        console.log(chatId);
        
        dispatch(getChatData(chatId))
    } catch (error) {
        console.log(error)
    }
})
const initialState: ChatState = {
    chats: null,
    chatLoading: false
};
export const ChatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
      // Get All Task
      builder.addCase(getChatData.pending, (state, action) => {
        state.chatLoading = true
      });
      builder.addCase(getChatData.fulfilled, (state, { payload }) => {
        state.chatLoading = false
        state.chats = payload;
        // console.log('chats:', payload)
      });
      builder.addCase(getChatData.rejected, (state, action) => {
        state.chatLoading = false
        state.chats = null;
      });
    },
  });
//   export const { setEditTask, setMess } = TaskSlice.actions;
  export const chatSelector = (state: RootState) => state.chats;
  export default ChatSlice.reducer;