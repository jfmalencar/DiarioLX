import { useMemo } from 'react';

import { useBootstrap } from '@/shared/hooks/useBootstrap';

import type { SettingsService, BackofficeSettings } from './settings.types';

import { useApi } from '../http/client';

export const useSettingsApiService = (): SettingsService => {
    const { get, put } = useApi();
    const { endpoints } = useBootstrap();

    return useMemo<SettingsService>(
        () => ({
            async fetch() {
                const result = await get<BackofficeSettings>(endpoints.backoffice.settings.get.href);
                if (!result.success) {
                    throw new Error(result.error || 'Failed to fetch settings');
                }
                return result.data;
            },

            async save(settings) {
                const result = await put(endpoints.backoffice.settings.update.href, settings);
                if (!result.success) {
                    throw new Error(result.error || 'Failed to save settings');
                }
            },
        }),
        [get, put, endpoints],
    );
};
