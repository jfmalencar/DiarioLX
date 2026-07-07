import { useSearchParams } from 'react-router-dom';

import { useContentList } from '@/shared/hooks/useContentList';

import { ContentListPage } from './ContentListPage';

export function Search() {
    const [params] = useSearchParams();
    const query = (params.get('q') ?? '').trim();

    const { contents, loading, error, hasMore, loadingMore, loadMore } = useContentList({ query });

    return (
        <ContentListPage
            title={query ? `Resultados para “${query}”` : 'Pesquisar'}
            contents={contents}
            loading={loading}
            error={error}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            emptyMessage={
                query
                    ? `Não foram encontrados resultados para “${query}”.`
                    : 'Escreva um termo para pesquisar.'
            }
        />
    );
}
