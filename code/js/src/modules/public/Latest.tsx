import { useContentList } from '@/shared/hooks/useContentList';
import { useI18n } from '@/shared/hooks/useI18n';

import { ContentListPage } from './ContentListPage';

export function Latest() {
    const { t } = useI18n();
    const { contents, loading, error, hasMore, loadingMore, loadMore } = useContentList({ type: 'ARTICLE' });

    return (
        <ContentListPage
            title={t('listing.latest_title')}
            contents={contents}
            loading={loading}
            error={error}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            emptyMessage={t('listing.empty')}
        />
    );
}
