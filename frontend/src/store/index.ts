import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workoutReducer from './slices/workoutSlice';
import trackingReducer from './slices/trackingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workout: workoutReducer,
    tracking: trackingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
