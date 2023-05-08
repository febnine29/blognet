import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import AuthSlice from '../features/auth/AuthSlice';
import PostSlice from '../type/PostSlice';
import CommentSlice from '../type/CommentSlice';
import ChildrenCmtSlice from '../type/ChildrenCmtSlice';
import UserSlice from '../type/UserSlice';
import ChatSlice from '../type/ChatSlice';
import ChatRoomSlice from '../type/ChatRoomSlice';
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: AuthSlice,
    posts: PostSlice,
    comments: CommentSlice,
    childrenCmt: ChildrenCmtSlice,
    user: UserSlice,
    chats: ChatSlice,
    chatRooms: ChatRoomSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
