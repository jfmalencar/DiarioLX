import type { BootstrapService, Endpoints } from './bootstrap.types';

export const bootstrapMockService: BootstrapService = {
  async fetchBootstrapData() {
    return { endpoints: {} as Endpoints };
  },
};
