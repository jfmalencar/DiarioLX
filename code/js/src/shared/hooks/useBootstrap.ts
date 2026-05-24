import { useContext } from 'react';
import { createContext } from 'react';

import type { Endpoints } from '../services/bootstrap/bootstrap.types';

export type { Endpoints }

export type BootstrapState = {
  endpoints: Endpoints;
  loading: boolean;
};

export const BootstrapContext = createContext<BootstrapState | null>(null);

export function useBootstrap(): BootstrapState {
  const context = useContext(BootstrapContext);
  if (!context) {
    throw new Error('useBootstrap must be used inside BootstrapProvider');
  }
  return context;
}
