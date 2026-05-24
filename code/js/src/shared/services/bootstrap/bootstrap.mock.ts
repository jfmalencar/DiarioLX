import { useMemo } from 'react';

import type { BootstrapService, Endpoints } from './bootstrap.types';

export const useBootstrapMockService = (): BootstrapService => {
  return useMemo<BootstrapService>(() => ({
    async fetchBootstrapData() {
      return { api: {} as Endpoints };
    },
  }), [])
};
