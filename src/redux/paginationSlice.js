import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 1, // 現在のページ
  hasNextPage: false, // 次のページがあるかどうか
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    nextPage: (state) => {
      state.currentPage += 1;
    },
    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    setHasNextPage: (state, action) => {
      state.hasNextPage = action.payload;
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.hasNextPage = false;
    },
  },
});

export const { nextPage, previousPage, setHasNextPage, resetPagination } = paginationSlice.actions;
export default paginationSlice.reducer;
