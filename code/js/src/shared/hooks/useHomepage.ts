import { useState, useEffect } from 'react';

import { useHomepageService } from '@/shared/services/homepage';
import type { HomepageResponse } from '@/shared/services/homepage/homepage.types';

export const useHomepage = () => {
    const homepageService = useHomepageService();
    const [data, setData] = useState<HomepageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        homepageService
            .getHomepage()
            .then((res) => {
                if (active) {
                    setData(res);
                    setError(null);
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch homepage');
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [homepageService]);

    return { data, loading, error };
};
