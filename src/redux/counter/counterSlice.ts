import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCount } from 'src/api/counterApi';
import { AppThunk } from 'src/app/store';
import { UserT } from 'src/models';
import { selectCount } from './counterSelector';

export interface CounterStateT {
  value: number;
  status: 'idle' | 'loading' | 'failed';
  user: UserT; // obj type create from model
}

const initialState: CounterStateT = {
  value: 0,
  status: 'idle',
  user: {
    id: '111',
    name: 'aa',
    // email:'email111',
    // gender: 'male'
  },
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: builder => {
    // call api xu dung vs redux thunk
    builder
      .addCase(incrementAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      });
  },
});

export const incrementAsync = createAsyncThunk('counter/fetchCount', async (amount: number) => {
  const response = await fetchCount(amount);
  return response.data;
});

export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    // viet logic
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount));
    }
  };

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
