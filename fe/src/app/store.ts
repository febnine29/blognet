import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import AuthSlice from '../features/auth/AuthSlice';
import PostSlice from '../type/PostSlice';
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: AuthSlice,
    posts: PostSlice
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
