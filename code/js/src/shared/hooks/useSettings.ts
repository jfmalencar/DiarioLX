import { useState, useCallback } from 'react';

import { useSettingsService } from '@/shared/services/settings';
import type { BackofficeSettings } from '@/shared/services/settings/settings.types';
import type { Result } from '@/shared/types/Result';
import { runAction } from '@/shared/utils/action';

export const useSettings = () => {
    const settingsService = useSettingsService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async (): Promise<BackofficeSettings | undefined> => {
        setLoading(true);
        setError(null);
        try {
            return await settingsService.fetch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch settings');
            return undefined;
        } finally {
            setLoading(false);
        }
    }, [settingsService]);

    const save = useCallback(
        (settings: BackofficeSettings): Promise<Result> =>
            runAction(() => settingsService.save(settings), 'Failed to save settings', setLoading, setError),
        [settingsService],
    );

    return { loading, error, fetch, save };
};
