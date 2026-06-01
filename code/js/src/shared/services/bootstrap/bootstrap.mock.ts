import { useMemo } from 'react';

import type { Assets, BootstrapService, Endpoints } from './bootstrap.types';

export const useBootstrapMockService = (): BootstrapService => {
  return useMemo<BootstrapService>(() => ({
    async fetchBootstrapData() {
      return { api: {} as Endpoints, assets: {} as Assets };
    },
  }), [])
};
