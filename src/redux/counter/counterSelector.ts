import { RootState } from 'src/app/store';

export const selectCount = (state: RootState) => state.counter.value;
