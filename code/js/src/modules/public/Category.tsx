import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useResourceContents } from '@/shared/hooks/useResourceContents';
import { useContentsService } from '@/shared/services/contents';
import type { Query } from '@/shared/types/Query';
import type { CategoryResource } from '@/shared/services/contents/contents.types';

import { ContentListPage } from './ContentListPage';

export function Category() {
    const { slug } = useParams<{ slug: string }>();
    const contentsService = useContentsService();
    const fetchCategory = useCallback(
        (s: string, params: Query) => contentsService.fetchCategory(s, params),
        [contentsService],
    );
    const { resource, contents, loading, error, hasMore, loadingMore, loadMore } = useResourceContents<CategoryResource>(
        fetchCategory,
        slug,
        { type: 'ARTICLE' },
    );

    return (
        <ContentListPage
            title={resource?.name ?? slug ?? ''}
            color={resource?.color || '#000'}
            contents={contents}
            loading={loading}
            error={error}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            emptyMessage='Não há conteúdos nesta categoria.'
        />
    );
}
