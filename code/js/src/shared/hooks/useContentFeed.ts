import { useCallback } from 'react';

import { useContentsService } from '@/shared/services/contents';
import type { ContentSummary, ContentsResponse } from '@/shared/services/contents/contents.types';

import { useLoadMore } from './useLoadMore';

export const useContentFeed = (params: Record<string, string | number | undefined>, size = 8) => {
    const contentsService = useContentsService();

    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') search.set(key, String(value));
    });
    search.set('size', String(size));
    const baseQuery = search.toString();
    const enabled = Object.entries(params).some(([, v]) => v !== undefined && v !== '');

    const fetchPage = useCallback(
        (page: number) =>
            contentsService.fetchPublicContents({ ...Object.fromEntries(new URLSearchParams(baseQuery)), page }),
        [contentsService, baseQuery],
    );

    const { items: contents, loading, loadingMore, hasMore, loadMore } =
        useLoadMore<ContentSummary, ContentsResponse>(enabled ? fetchPage : null);

    return { contents, loading: loading || loadingMore, hasMore, loadMore };
};
