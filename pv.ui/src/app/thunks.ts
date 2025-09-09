import { AppDispatch } from './store';
import { fetchLiveData as fetchLiveDataAPI } from '../api/api';
import { fetchLiveDataFailure, fetchLiveDataStart, fetchLiveDataSuccess } from './LiveDataSlice';

export const fetchLiveDataThunk = () => async (dispatch: AppDispatch) => {
  dispatch(fetchLiveDataStart());
  try {
    const response = await fetchLiveDataAPI();
    dispatch(fetchLiveDataSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchLiveDataFailure(error.toString()));
  }
};