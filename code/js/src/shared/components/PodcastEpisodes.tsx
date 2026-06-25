import { useContentFeed } from '@/shared/hooks/useContentFeed';

import { ContentGridSection } from './ContentGridSection';

// Lists a podcast's episodes (its child contents) with "load more" paging.
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
