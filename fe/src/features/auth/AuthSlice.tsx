import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string;
}

const initialState: AuthState = {
  accessToken: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    storeAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { storeAccessToken } = authSlice.actions;
export default authSlice.reducer