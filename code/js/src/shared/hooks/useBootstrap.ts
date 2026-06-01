import { useContext } from 'react';
import { createContext } from 'react';

import type { Endpoints, Assets } from '../services/bootstrap/bootstrap.types';

export type { Endpoints, Assets }

export type BootstrapState = {
  assets: Assets;
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
