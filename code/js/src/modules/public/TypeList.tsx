import type { ReactNode } from 'react';
import { CirclePlay, AudioLines, Images } from 'lucide-react';

import { useContentList } from '@/shared/hooks/useContentList';
import type { ContentType } from '@/shared/services/contents/contents.types';

import { ContentListPage } from './ContentListPage';

type Props = {
    type: ContentType;
    title: string;
}

type TypeTheme = {
    dark: boolean;
    color: string;
    icon: ReactNode;
    fullDark?: boolean;
};

const THEME: Partial<Record<ContentType, TypeTheme>> = {
    VIDEO: { dark: true, color: '#D4E600', icon: <CirclePlay size={40} strokeWidth={1} /> },
    PODCAST: { dark: true, color: '#82EE64', icon: <AudioLines size={40} strokeWidth={1} /> },
    PHOTO_ESSAY: { dark: true, fullDark: true, color: '#fff', icon: <Images size={40} strokeWidth={1} /> },
};

export function TypeList({ type, title }: Props) {
    const { contents, loading, error, hasMore, loadingMore, loadMore } = useContentList({ type });
    const theme = THEME[type];

    return (
        <ContentListPage
            title={title}
            contents={contents}
            loading={loading}
            error={error}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            emptyMessage='Não há conteúdos para mostrar.'
            color={theme?.color}
            icon={theme?.icon}
            dark={theme?.dark}
            fullDark={theme?.fullDark}
        />
    );
}
