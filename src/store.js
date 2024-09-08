// src/store.js
import { configureStore } from '@reduxjs/toolkit';
// 認証状態に関するロジックを管理するスライス
import authReducer from './authSlice'; // authSlice.js のパスに合わせて修正

export const store = configureStore({
  reducer: {
    auth: authReducer, // スライスのリデューサーを設定
  },
});
