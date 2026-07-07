import { useSearchParams } from 'react-router-dom';

import { useContentList } from '@/shared/hooks/useContentList';
import { useI18n } from '@/shared/hooks/useI18n';

import { ContentListPage } from './ContentListPage';

export function Search() {
    const [params] = useSearchParams();
    const query = (params.get('q') ?? '').trim();
    const { t } = useI18n();

    const { contents, loading, error, hasMore, loadingMore, loadMore } = useContentList({ query });

    return (
        <ContentListPage
            title={query ? t('search.results_title', { query }) : t('search.placeholder')}
            contents={contents}
            loading={loading}
            error={error}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            emptyMessage={
                query
                    ? t('search.no_results', { query })
                    : t('search.empty_prompt')
            }
        />
    );
}
