import { useContentList } from '@/shared/hooks/useContentList';

import { ContentListPage } from './ContentListPage';

export function Latest() {
    const { contents, loading, error, hasMore, loadingMore, loadMore } = useContentList({ type: 'ARTICLE' });

    return (
        <ContentListPage
            title='Últimas'
            contents={contents}
            loading={loading}
            error={error}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            emptyMessage='Não há conteúdos para mostrar.'
        />
    );
}
