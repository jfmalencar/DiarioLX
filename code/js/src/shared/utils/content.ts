import type { ContentSummary, ContentType } from '@/shared/services/contents/contents.types';
import { youtubeThumb } from '@/shared/utils/embed';

const MONTHS = [
    'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
];

const TYPE_ACCENT: Partial<Record<ContentType, string>> = {
    VIDEO: '#D4E600',
    PODCAST: '#82EE64',
    EPISODE: '#82EE64',
    PHOTO_ESSAY: '#555555',
};

export const contentAccent = (type: ContentType, categoryColor?: string | null, fallback = '#000'): string =>
    TYPE_ACCENT[type] ?? categoryColor ?? fallback;

export const contentHref = (content: ContentSummary) => content.slug ? `/p/${content.slug}` : '#';

export const contentThumbnail = (content: Pick<ContentSummary, 'featuredImage' | 'embedUrl'>): string | null => {
    if (content.embedUrl) {
        const thumb = youtubeThumb(content.embedUrl);
        if (thumb) return thumb;
    }
    return content.featuredImage;
};

export const isVideoThumbnail = (content: Pick<ContentSummary, 'type' | 'embedUrl'>): boolean => content.type === 'VIDEO' && !content.embedUrl;

export const contentDate = (content: ContentSummary) => {
    if (!content.publishedAt) return '';
    const date = new Date(content.publishedAt);
    return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
};
