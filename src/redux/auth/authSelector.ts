import { RootState } from 'src/app/store';
export const authSelector = (state: RootState) => {
  return {
    authStatus: state.auth.authStatus,
    toastOptions: state.auth.toastOptions,
    isLoading: state.auth.isLoading,
  };
};
