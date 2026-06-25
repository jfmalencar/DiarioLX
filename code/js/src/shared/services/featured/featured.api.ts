import { useMemo } from 'react';

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type {
  FeaturedService,
  BackofficeHomepageResponse,
  SaveHomepageRequest,
} from './featured.types';

import { useApi } from '../http/client';

export const useFeaturedApiService = (): FeaturedService => {
  const { get, put } = useApi();
  const { endpoints } = useBootstrap();

  return useMemo<FeaturedService>(
    () => ({
      async getHomepage() {
        const result = await get<BackofficeHomepageResponse>(endpoints.backoffice.featured.get.href);
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch homepage');
        }
        return result.data;
      },

      async save(request: SaveHomepageRequest) {
        const result = await put(endpoints.backoffice.featured.update.href, request);
        if (!result.success) {
          throw new Error(result.error || 'Failed to save homepage');
        }
      },
    }),
    [get, put, endpoints],
  );
};

