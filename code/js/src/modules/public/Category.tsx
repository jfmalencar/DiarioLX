import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useResourceContents } from '@/shared/hooks/useResourceContents';
import { useI18n } from '@/shared/hooks/useI18n';
import { useContentsService } from '@/shared/services/contents';
import type { Query } from '@/shared/types/Query';
import type { CategoryResource } from '@/shared/services/contents/contents.types';

import { ContentListPage } from './ContentListPage';
import { NotFound } from './NotFound';

export function Category() {
    const { slug } = useParams<{ slug: string }>();
    const { t } = useI18n();
    const contentsService = useContentsService();
    const fetchCategory = useCallback(
        (s: string, params: Query) => contentsService.fetchCategory(s, params),
        [contentsService],
    );
    const { resource, contents, loading, error, hasMore, loadingMore, loadMore } = useResourceContents<CategoryResource>(
        fetchCategory,
        slug,
    );

    if (!loading && !resource) {
        return <NotFound />;
    }

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
            emptyMessage={t('listing.category_empty')}
        />
    );
}
