import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useResourceContents } from '@/shared/hooks/useResourceContents';
import { useContentsService } from '@/shared/services/contents';
import type { Query } from '@/shared/types/Query';
import type { TagResource } from '@/shared/services/contents/contents.types';

import { ContentListPage } from './ContentListPage';

export function Tag() {
    const { slug } = useParams<{ slug: string }>();
    const contentsService = useContentsService();
    const fetchTag = useCallback(
        (s: string, params: Query) => contentsService.fetchTag(s, params),
        [contentsService],
    );
    const { resource, contents, loading, error, hasMore, loadingMore, loadMore } = useResourceContents<TagResource>(fetchTag, slug);

    const title = `#${resource?.name ?? slug ?? ''}`;

    return (
        <ContentListPage
            title={title}
            contents={contents}
            loading={loading}
            error={error}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            emptyMessage='Não há conteúdos com esta tag.'
        />
    );
}
