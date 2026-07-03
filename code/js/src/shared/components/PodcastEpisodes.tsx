import { useContentFeed } from '@/shared/hooks/useContentFeed';

import { ContentGridSection } from './ContentGridSection';

export const PodcastEpisodes = ({ podcastId }: { podcastId: number }) => {
    const { contents, loading, hasMore, loadMore } = useContentFeed(
        { parentId: podcastId, type: 'EPISODE' },
        8,
    );

    return (
        <ContentGridSection
            title='Episódios'
            contents={contents}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
        />
    );
};
