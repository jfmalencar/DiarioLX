import { useMemo } from 'react';

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { HomepageService, HomepageResponse } from './homepage.types';

import { useApi } from '../http/client';

export const useHomepageApiService = (): HomepageService => {
    const { get } = useApi();
    const { endpoints } = useBootstrap();

    return useMemo<HomepageService>(
        () => ({
            async getHomepage() {
                const result = await get<HomepageResponse>(endpoints.guest.homepage.href);
                if (!result.success) {
                    throw new Error(result.error || 'Failed to fetch homepage');
                }
                return result.data;
            },
        }),
        [get, endpoints],
    );
};
