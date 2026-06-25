import { useParams } from 'react-router-dom';

import { useContentList } from '@/shared/hooks/useContentList';

import { ContentListPage } from './ContentListPage';

export function Category() {
    const { slug } = useParams<{ slug: string }>();
    const { contents, loading, error } = useContentList({ category: slug, type: 'ARTICLE' });
    const title = contents[0]?.category?.name;

    return (
        <ContentListPage
            title={title}
            contents={contents}
            color={contents[0]?.category?.color || '#000'}
            loading={loading}
            error={error}
            emptyMessage='Não há conteúdos nesta categoria.'
        />
    );
}
