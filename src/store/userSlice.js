import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: 'John Doe',
  profilePicture: '/defaultProfilePic.png',
  email: 'john.doe@example.com',
  watchedMovies: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    setWatchedMovies: (state, action) => {
      state.watchedMovies = action.payload;
    }
  }
});

export const { setUser, setWatchedMovies } = userSlice.actions;

export default userSlice.reducer;
