import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import calculationReducer from './calculationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    calculations: calculationReducer,
  },
});