import { createSlice } from '@reduxjs/toolkit';
import { ACTION_TYPE_SLICE } from 'src/app/actionType';

export interface AuthStateT {
  authStatus: boolean | undefined;
  toastOptions: {
    message: string;
    showToast: boolean;
    status: 'success' | 'error';
  };
  isLoading: 'idle' | 'loading' | 'failed' | string;
}

const initialState: AuthStateT = {
  authStatus: undefined,
  toastOptions: { message: '', showToast: false, status: 'error' },
  isLoading: 'idle',
};

export const authSlice = createSlice({
  name: ACTION_TYPE_SLICE.AUTH.INDEX,
  initialState,
  reducers: {
    onSetAuthStatus: (state, action) => {
      state.authStatus = action.payload;
    },
    onSetToastStatus: (state, action) => {
      state.toastOptions = action.payload;
    },
    onSetShowLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    onResetToast: state => {
      state.toastOptions.showToast = false;
    },
  },
});

export const { onSetAuthStatus, onSetToastStatus, onSetShowLoading, onResetToast } = authSlice.actions;

export default authSlice.reducer;
