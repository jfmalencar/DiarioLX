import type { Media } from '@/shared/services/media/media.types';
import type { ContentBlock, Content, ContentType, ContentState } from '@/shared/services/contents/contents.types';

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
    state?: ContentState;
    title: string;
    headline: string;
    category: Option;
    categorySearch: string;
    parent: Option;
    parentSearch: string;
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
    embedUrl: string;
};

export type GalleryMode = 'featured' | 'block' | 'video-block' | 'audio-block' | 'gallery' | null;

export type EditContentState = {
    tag: 'loading' | 'editing';
    contentId: number | null;
    isDirty: boolean;
    contentData: ContentEditingInput;
    blocks: ContentBlock[];
    galleryMode: GalleryMode;
    galleryAfterId?: number
    galleryTargetBlockId?: number
};

export type EditContentAction =
    | { type: 'init'; content: Content }
    | { type: 'edit'; field: keyof ContentEditingInput; value: ContentEditingInput[keyof ContentEditingInput]; }
    | { type: 'select-single'; field: SingleField; searchField: SingleSearchField; option: Option; }
    | { type: 'clear-single'; field: SingleField; searchField: SingleSearchField; }
    | { type: 'add-secondary'; field: SecondaryField; searchField: SecondarySearchField; option: Option; }
    | { type: 'remove-secondary'; field: SecondaryField; id: number; }
    | { type: 'open-gallery'; payload: Exclude<GalleryMode, null>, afterId?: number }
    | { type: 'open-gallery-add-more'; blockId: number }
    | { type: 'close-gallery' }
    | { type: 'select-media'; payload: Media }
    | { type: 'select-media-many'; payload: Media[] }
    | { type: 'update-gallery-caption'; payload: { blockId: number; imageIndex: number; caption: string } }
    | { type: 'remove-gallery-image'; payload: { blockId: number; imageIndex: number } }
    | { type: 'add-text-block', afterId?: number }
    | { type: 'add-heading-block', level: 3 | 4, afterId?: number }
    | { type: 'add-quote-block', afterId?: number }
    | { type: 'add-embed-block', afterId?: number }
    | { type: 'update-content-block'; payload: { blockId: number; content: string } }
    | { type: 'remove-block'; payload: { blockId: number } }
    | { type: 'update-text-block'; payload: { blockId: number; content: string } }
    | { type: 'set-content-id'; payload: number }
    | { type: 'set-dirty'; payload: boolean };

type SingleField = 'category' | 'mainTag' | 'mainAuthor' | 'parent';
type SingleSearchField = 'categorySearch' | 'mainTagSearch' | 'mainAuthorSearch' | 'parentSearch'
type SecondaryField = 'secondaryTags' | 'secondaryAuthors';
type SecondarySearchField = 'secondaryTagSearch' | 'secondaryAuthorSearch';