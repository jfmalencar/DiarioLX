import { useParams } from 'react-router-dom';

import { useTagContents } from '@/shared/hooks/useTagContents';

import { ContentListPage } from './ContentListPage';

export function Tag() {
    const { slug } = useParams<{ slug: string }>();
    const { contents, loading, error } = useTagContents(slug);
    const tagName = contents[0]?.tag?.name;
    const title = tagName ? `#${tagName}` : (slug ?? '');

    return (
        <ContentListPage
            title={title}
            contents={contents}
            loading={loading}
            error={error}
            emptyMessage='Não há conteúdos com esta tag.'
        />
    );
}
