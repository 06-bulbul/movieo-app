import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isClicked: true,
};

const clickSlice = createSlice({
  name: 'click', 
  initialState,
  reducers: {
    toggleClick: (state) => {
      state.isClicked = !state.isClicked; 
    },
  },
});

export const { toggleClick } = clickSlice.actions;
export default clickSlice.reducer;