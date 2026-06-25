import { useState, useEffect, useCallback, useRef } from 'react';

import { useApi } from '@/shared/services/http/client';
import { useBootstrap } from '@/shared/hooks/useBootstrap';
import type { ContentSummary, ContentsResponse } from '@/shared/services/contents/contents.types';

export const useContentFeed = (params: Record<string, string | number | undefined>, size = 8) => {
    const { get } = useApi();
    const { endpoints } = useBootstrap();

    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') search.set(key, String(value));
    });
    search.set('size', String(size));

    const baseQuery = search.toString();
    const enabled = Object.entries(params).some(([, v]) => v !== undefined && v !== '');

    const listHref = endpoints.guest.listContent.href;

    const [contents, setContents] = useState<ContentSummary[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(enabled);
    const pageRef = useRef(1);

    const load = useCallback(
        (page: number) => {
            pageRef.current = page;
            return get<ContentsResponse>(`${listHref}?${baseQuery}&page=${page}`)
                .then((result) => {
                    if (result.success) {
                        setContents((prev) =>
                            page === 1 ? result.data.items : [...prev, ...result.data.items],
                        );
                        setHasMore(result.data.pagination.hasNext);
                    }
                })
                .finally(() => setLoading(false));
        },
        [get, listHref, baseQuery],
    );

    useEffect(() => {
        if (!enabled) return;
        load(1);
    }, [baseQuery, enabled, load]);

    const loadMore = useCallback(() => {
        if (!hasMore || loading) return;
        setLoading(true);
        load(pageRef.current + 1);
    }, [hasMore, loading, load]);

    return { contents, loading, hasMore, loadMore };
};
