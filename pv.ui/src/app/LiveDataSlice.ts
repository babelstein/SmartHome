import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LiveDataResponse } from '../types/models';

interface LiveDataState {
  data: LiveDataResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LiveDataState = {
  data: null,
  status: 'idle',
  error: null,
};

const liveDataSlice = createSlice({
  name: 'liveData',
  initialState,
  reducers: {
    setLiveData(state, action: PayloadAction<LiveDataResponse>) {
      state.data = action.payload;
    },
    fetchLiveDataStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    fetchLiveDataSuccess(state, action: PayloadAction<LiveDataResponse>) {
      state.data = action.payload;
      state.status = 'succeeded';
    },
    fetchLiveDataFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  setLiveData,
  fetchLiveDataStart,
  fetchLiveDataSuccess,
  fetchLiveDataFailure,
} = liveDataSlice.actions;

export default liveDataSlice.reducer;