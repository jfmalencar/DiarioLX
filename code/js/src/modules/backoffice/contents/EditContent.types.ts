import type { Media } from '@/shared/services/media/media.types';
import type { ContentBlock, Content, ContentType } from '@/shared/services/contents/contents.types';

export type Option = {
    id: number;
    name: string;
};

export type ImageBlockProps = {
    url: string;
    alt: string;
    width?: number;
};

export type ContentEditingInput = {
    type?: ContentType;
    title: string;
    headline: string;
    category: Option;
    categorySearch: string;
    slug: string;

    mainTag: Option;
    mainTagSearch: string;
    secondaryTags: Option[];
    secondaryTagSearch: string;

    mainAuthor: Option;
    mainAuthorSearch: string;
    secondaryAuthors: Option[];
    secondaryAuthorSearch: string;

    featuredMedia: Media | null;
};

export type GalleryMode = 'featured' | 'block' | null;

export type EditContentState = {
    tag: 'loading' | 'editing';
    contentId: number | null;
    isDirty: boolean;
    contentData: ContentEditingInput;
    blocks: ContentBlock[];
    galleryMode: GalleryMode;
    galleryAfterId?: number
};

export type EditContentAction =
    | { type: 'init'; content: Content }
    | {
        type: 'edit';
        field: keyof ContentEditingInput;
        value: ContentEditingInput[keyof ContentEditingInput];
    }

    | {
        type: 'select-single';
        field: 'category' | 'mainTag' | 'mainAuthor';
        searchField: 'categorySearch' | 'mainTagSearch' | 'mainAuthorSearch';
        option: Option;
    }

    | {
        type: 'clear-single';
        field: 'category' | 'mainTag' | 'mainAuthor';
        searchField: 'categorySearch' | 'mainTagSearch' | 'mainAuthorSearch';
    }

    | {
        type: 'add-secondary';
        field: 'secondaryTags' | 'secondaryAuthors';
        searchField: 'secondaryTagSearch' | 'secondaryAuthorSearch';
        option: Option;
    }

    | {
        type: 'remove-secondary';
        field: 'secondaryTags' | 'secondaryAuthors';
        id: number;
    }

    | { type: 'open-gallery'; payload: Exclude<GalleryMode, null>, afterId?: number }
    | { type: 'close-gallery' }
    | { type: 'select-media'; payload: Media }

    | { type: 'add-text-block', afterId?: number }
    | { type: 'add-heading-block', level: 3 | 4, afterId?: number }
    | { type: 'add-quote-block', afterId?: number }
    | { type: 'update-content-block'; payload: { blockId: number; content: string } }
    | { type: 'remove-block'; payload: { blockId: number } }
    | { type: 'update-text-block'; payload: { blockId: number; content: string } }

    | { type: 'set-content-id'; payload: number }
    | { type: 'set-dirty'; payload: boolean }
