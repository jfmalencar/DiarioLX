import type { Media } from '@/shared/services/media/media.types';
import type { ArticleBlock } from '@/shared/services/articles/articles.types';

export type Option = {
    id: string;
    name: string;
};

export type ImageBlockProps = {
    url: string;
    alt: string;
    width?: number;
};

export type ArticleEditingInput = {
    title: string;
    slug: string;
    headline: string;

    category: Option;
    categorySearch: string;

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

export type EditArticleState = {
    tag: 'loading' | 'editing';
    articleData: ArticleEditingInput;
    blocks: ArticleBlock[];
    galleryMode: GalleryMode;
};

export type EditArticleAction =
    | {
        type: 'edit';
        field: keyof ArticleEditingInput;
        value: ArticleEditingInput[keyof ArticleEditingInput];
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
        id: string;
    }

    | { type: 'open-gallery'; payload: Exclude<GalleryMode, null> }
    | { type: 'close-gallery' }
    | { type: 'select-media'; payload: Media }

    | { type: 'add-text-block' }
    | { type: 'remove-block'; payload: { blockId: string } }
    | { type: 'update-text-block'; payload: { blockId: string; content: string } };
