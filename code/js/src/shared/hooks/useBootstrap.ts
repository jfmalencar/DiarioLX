import { useContext } from 'react';
import { createContext } from 'react';

import type { Endpoints, Assets, CreditRole, SectionTypeConfig, SiteSettings } from '../services/bootstrap/bootstrap.types';

export type { Endpoints, Assets, CreditRole, SectionTypeConfig, SiteSettings }

export type BootstrapState = {
  endpoints: Endpoints;
  assets: Assets;
  creditRoles: CreditRole[];
  sections: SectionTypeConfig[];
  settings: SiteSettings;
  loading: boolean;
  reload: () => Promise<{ api: Endpoints }>;
};

export const BootstrapContext = createContext<BootstrapState | null>(null);

export function useBootstrap(): BootstrapState {
  const context = useContext(BootstrapContext);
  if (!context) {
    throw new Error('useBootstrap must be used inside BootstrapProvider');
  }
  return context;
}
