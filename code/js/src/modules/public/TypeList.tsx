import type { ReactNode } from 'react';
import { CirclePlay, AudioLines, Images } from 'lucide-react';

import { useContentList } from '@/shared/hooks/useContentList';
import { useI18n } from '@/shared/hooks/useI18n';
import type { ContentType } from '@/shared/services/contents/contents.types';

import { ContentListPage } from './ContentListPage';

type Props = {
    type: ContentType;
}

const TITLE_KEY: Partial<Record<ContentType, string>> = {
    PHOTO_ESSAY: 'type.photos',
    PODCAST: 'type.podcasts',
    VIDEO: 'type.videos',
};

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

export function TypeList({ type }: Props) {
    const { t } = useI18n();
    const { contents, loading, error, hasMore, loadingMore, loadMore } = useContentList({ type });
    const theme = THEME[type];
    const titleKey = TITLE_KEY[type];

    return (
        <ContentListPage
            title={titleKey ? t(titleKey) : ''}
            contents={contents}
            loading={loading}
            error={error}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            emptyMessage={t('listing.empty')}
            color={theme?.color}
            icon={theme?.icon}
            dark={theme?.dark}
            fullDark={theme?.fullDark}
        />
    );
}
