import { createSlice } from '@reduxjs/toolkit';
import { ACTION_TYPE_SLICE } from 'src/app/actionType';

export interface TableStateT {
  reLoadLink: {
    isCreate?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
    isResetSelected?: boolean;
  };
}

const initialState: TableStateT = {
  reLoadLink: {
    isCreate: false,
    isEdit: false,
    isDelete: false,
    isResetSelected: false,
  },
};

export const tableSlice = createSlice({
  name: ACTION_TYPE_SLICE.TABLE.INDEX,
  initialState,
  reducers: {
    onReLoadDataTableByLink: (state, action) => {
      state.reLoadLink = action.payload;
    },
  },
});

export const { onReLoadDataTableByLink } = tableSlice.actions;

export default tableSlice.reducer;
