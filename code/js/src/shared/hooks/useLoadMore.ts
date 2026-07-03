import { useState, useEffect, useCallback, useRef } from 'react';

import type { Pagination } from '@/shared/types/Pagination';

type Paged<T> = { items: T[]; pagination: Pagination };

export const useLoadMore = <T, R extends Paged<T>>(fetchPage: ((page: number) => Promise<R>) | null) => {
    const [response, setResponse] = useState<R | null>(null);
    const [items, setItems] = useState<T[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(!!fetchPage);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pageRef = useRef(1);

    const load = useCallback(
        (page: number) => {
            if (!fetchPage) return Promise.resolve();
            pageRef.current = page;
            return fetchPage(page)
                .then((data) => {
                    setResponse(data);
                    setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
                    setHasMore(data.pagination.hasNext);
                    setError(null);
                })
                .catch((err) => {
                    setError(err instanceof Error ? err.message : 'Failed to fetch contents');
                    if (page === 1) {
                        setResponse(null);
                        setItems([]);
                    }
                })
                .finally(() => {
                    setLoading(false);
                    setLoadingMore(false);
                });
        },
        [fetchPage],
    );

    useEffect(() => {
        if (!fetchPage) return;
        load(1);
    }, [fetchPage, load]);

    const loadMore = useCallback(() => {
        if (!hasMore || loading || loadingMore) return;
        setLoadingMore(true);
        load(pageRef.current + 1);
    }, [hasMore, loading, loadingMore, load]);

    const reload = useCallback(() => load(1), [load]);

    return { response, items, hasMore, loadMore, reload, loading, loadingMore, error };
}
