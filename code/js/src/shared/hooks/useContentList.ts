import { useCallback } from 'react';

import { useContentsService } from '@/shared/services/contents';
import type { ContentSummary, ContentsResponse } from '@/shared/services/contents/contents.types';

import { useLoadMore } from './useLoadMore';

const PAGE_SIZE = 12;

export const useContentList = (params: Record<string, string | undefined>) => {
    const contentsService = useContentsService();

    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value) search.set(key, value);
    });
    search.set('size', String(PAGE_SIZE));
    const baseQuery = search.toString();
    const enabled = Object.values(params).some(Boolean);

    const fetchPage = useCallback(
        (page: number) =>
            contentsService.fetchPublicContents({ ...Object.fromEntries(new URLSearchParams(baseQuery)), page }),
        [contentsService, baseQuery],
    );

    const { items: contents, loading, loadingMore, hasMore, loadMore, error } =
        useLoadMore<ContentSummary, ContentsResponse>(enabled ? fetchPage : null);

    return { contents, loading, loadingMore, hasMore, loadMore, error };
};
