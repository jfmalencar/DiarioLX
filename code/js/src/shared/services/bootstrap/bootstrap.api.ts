import { get } from '../http/client';
import type { BootstrapService, BootstrapData } from './bootstrap.types';

export const bootstrapApiService: BootstrapService = {
  async fetchBootstrapData() {
    const result = await get<BootstrapData>('/api');
    if (!result.success) {
      throw new Error('Failed to fetch bootstrap data');
    }
    return result.data;
  },
};
