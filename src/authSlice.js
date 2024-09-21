// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSignIn: false, // デフォルト値
  username: '', // ユーザー名を追加
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInAction: (state, action) => {
      state.isSignIn = true;
      state.username = action.payload.username; // ユーザー名を状態に保存
    },
    signOut: (state) => {
      state.isSignIn = false;
      state.username = '';
    },
  },
});

export const { signInAction, signOut } = authSlice.actions;
export default authSlice.reducer;
