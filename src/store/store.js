import { configureStore } from '@reduxjs/toolkit'
import movieoReducer from './movieoSlice'
import clickReducer from './clickSlice'; 
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    movieoData : movieoReducer,
    click_redux_slice: clickReducer,
    user: userReducer,
  },
})