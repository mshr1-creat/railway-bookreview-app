// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSignIn: false, // デフォルト値
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInAction: (state) => {
      state.isSignIn = true;
    },
    signOut: (state) => {
      state.isSignIn = false;
    },
  },
});

export const { signInAction, signOut } = authSlice.actions;
export default authSlice.reducer;
