import { useContext, createContext } from 'react';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

export type SnackbarContextType = {
  showSnackbar: (
    message: string,
    type?: SnackbarType,
    delay?: number
  ) => void;
};

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }

  return context;
}
