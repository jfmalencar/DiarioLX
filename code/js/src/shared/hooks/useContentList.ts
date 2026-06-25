import { useState, useEffect } from 'react';

import { useApi } from '@/shared/services/http/client';
import { useBootstrap } from '@/shared/hooks/useBootstrap';
import type { ContentSummary, ContentsResponse } from '@/shared/services/contents/contents.types';

export const useContentList = (params: Record<string, string | undefined>) => {
    const { get } = useApi();
    const { endpoints } = useBootstrap();

    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) search.set(key, value);
    });
    const queryString = search.toString();

    const [contents, setContents] = useState<ContentSummary[]>([]);
    const [loading, setLoading] = useState(queryString.length > 0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!queryString) return;
        let active = true;
        const url = `${endpoints.guest.listContent.href}?${queryString}`;
        get<ContentsResponse>(url)
            .then((result) => {
                if (!active) return;
                if (result.success) {
                    setContents(result.data.items);
                    setError(null);
                } else {
                    setError(result.error);
                    setContents([]);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [queryString, endpoints, get]);

    return { contents, loading, error };
};
