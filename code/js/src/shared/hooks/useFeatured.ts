import { useState, useCallback } from 'react';

import { useFeaturedService } from '@/shared/services/featured';
import type { FeaturedSectionResponse, SaveHomepageRequest } from '@/shared/services/featured/featured.types';
import type { Result } from '@/shared/types/Result';
import { runAction } from '@/shared/utils/action';

export const useFeatured = () => {
    const [sections, setSections] = useState<FeaturedSectionResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const featuredService = useFeaturedService();

    const fetchHomepage = useCallback(
        async (): Promise<FeaturedSectionResponse[] | undefined> => {
            setLoading(true);
            setError(null);
            try {
                const data = await featuredService.getHomepage();
                setSections(data.sections);
                return data.sections;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch homepage';
                setError(message);
                setSections([]);
                return undefined;
            } finally {
                setLoading(false);
            }
        },
        [featuredService],
    );

    const save = useCallback(
        (request: SaveHomepageRequest): Promise<Result> =>
            runAction(() => featuredService.save(request), 'Failed to save homepage', setLoading, setError),
        [featuredService],
    );

    return {
        loading,
        error,
        sections,
        fetchHomepage,
        save,
    };
};