import { RootState } from 'src/app/store';
export const tableSelector = (state: RootState) => {
  return {
    reLoadLink: state.table.reLoadLink,
  };
};
