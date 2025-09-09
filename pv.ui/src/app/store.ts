import { configureStore } from '@reduxjs/toolkit';
import * as slice  from './LiveDataSlice';

export const store = configureStore({
  reducer: {
    liveData: slice.default,
    // add other slices here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;