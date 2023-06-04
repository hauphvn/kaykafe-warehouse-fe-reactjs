import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from 'src/redux/counter/counterSlice';
import authReducer from 'src/redux/auth/authSlice';
import tableReducer from 'src/redux/table/tableSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    table: tableReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
