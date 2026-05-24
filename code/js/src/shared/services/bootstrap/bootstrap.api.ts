import { useMemo } from 'react'

import type { BootstrapService, BootstrapData } from './bootstrap.types';

export const useBootstrapApiService = (): BootstrapService => {

  return useMemo<BootstrapService>(() => ({
    async fetchBootstrapData() {
      const result = await fetch('/api');
      if (!result.ok) {
        throw new Error('Failed to fetch bootstrap data');
      }
      const data: Promise<BootstrapData> = result.json();
      return data
    }
  }), [])
};
