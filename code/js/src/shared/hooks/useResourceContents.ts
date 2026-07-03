import { useCallback } from 'react';

import type { ContentSummary, ResourceContentsResponse } from '@/shared/services/contents/contents.types';
import type { Query } from '@/shared/types/Query';

import { useLoadMore } from './useLoadMore';

const PAGE_SIZE = 7;

type ResourceFetcher<T> = (slug: string, params: Query) => Promise<ResourceContentsResponse<T>>;

export const useResourceContents = <T,>(
    fetcher: ResourceFetcher<T>,
    slug: string | undefined,
    params: Record<string, string | undefined> = {},
) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) search.set(key, value);
    });
    search.set('size', String(PAGE_SIZE));
    const baseQuery = search.toString();

    const fetchPage = useCallback(
        (page: number) =>
            fetcher(slug as string, { ...Object.fromEntries(new URLSearchParams(baseQuery)), page }),
        [fetcher, slug, baseQuery],
    );

    const { response, items: contents, hasMore, loadMore, loading, loadingMore, error } =
        useLoadMore<ContentSummary, ResourceContentsResponse<T>>(slug ? fetchPage : null);

    return { resource: response?.resource ?? null, contents, hasMore, loadMore, loading, loadingMore, error };
};
