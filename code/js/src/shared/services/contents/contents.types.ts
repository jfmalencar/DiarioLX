import type { Query } from '@/shared/types/Query';
import type { Media } from '@/shared/services/media/media.types';
import type { Pagination } from '@/shared/types/Pagination';

export type ContentType = 'ARTICLE' | 'VIDEO' | 'EPISODE' | 'PODCAST' | 'PHOTO_ESSAY';

export type ContentState = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED'

export type Content = {
    id: number;
    title: string;
    slug: string;
    state: ContentState;
    type: ContentType;
    headline: string;
    featuredImage: Media | null;
    blocks: ContentBlock[];
    category: {
        id: number;
        name: string;
        slug: string;
        color: string
    }
    parentId: number | null;
    parent: {
        id: number;
        title: string;
        slug: string | null;
        image: string | null;
    } | null;
    embedUrl: string | null;
    authors: {
        id: number;
        slug: string;
        name: string;
    }[]
    tags: {
        id: number;
        name: string;
        slug: string;
    }[]
    createdAt: string;
    updatedAt: string;
    archivedAt: string | null;
    publishedAt: string | null;
};

export type HistoryEntryType = 'approved' | 'rejected';

export type HistoryEntry = {
    id: string;
    type: HistoryEntryType;
    date: string;
    by: string | null;
    comment: string | null;
};

export type ContentHistory = {
    history: HistoryEntry[]
}

export type ContentSummary = {
    id: number;
    title: string;
    headline: string;
    state: ContentState;
    type: ContentType;
    slug: string;
    featuredImage: string | null;
    embedUrl: string | null;
    category: {
        id: number
        name: string
        slug: string
        color: string
    }
    tag: {
        id: number
        name: string
        slug: string
    }
    authors: {
        id: number
        name: string
        slug: string
    }[]
    createdAt: string
    publishedAt: string | null
}

type ContentBlockBase = {
    id: number;
    position: number;
};

export type ContentH3Block = ContentBlockBase & {
    type: 'H3';
    content: string;
};

export type ContentH4Block = ContentBlockBase & {
    type: 'H4';
    content: string;
};

export type ContentQuoteBlock = ContentBlockBase & {
    type: 'QUOTE';
    content: string;
};

export type ContentTextBlock = ContentBlockBase & {
    type: 'TEXT';
    content: string;
};

export type ContentMediaBlock = ContentBlockBase & {
    type: 'MEDIA';
    media: Media;
    caption: string | null;
};

export type GalleryImage = {
    media: Media;
    caption: string | null;
};

export type ContentGalleryBlock = ContentBlockBase & {
    type: 'GALLERY';
    images: GalleryImage[];
};

export type ContentEmbedBlock = ContentBlockBase & {
    type: 'EMBED';
    content: string;
};

export type ContentBlock =
    | ContentTextBlock
    | ContentQuoteBlock
    | ContentMediaBlock
    | ContentGalleryBlock
    | ContentEmbedBlock
    | ContentH3Block
    | ContentH4Block

export type ContentBlockRequest =
    | { type: 'H3'; id: number, position: number, content: string }
    | { type: 'H4'; id: number, position: number, content: string }
    | { type: 'TEXT'; id: number, position: number, content: string }
    | { type: 'QUOTE'; id: number, position: number, content: string }
    | { type: 'MEDIA'; id: number, position: number, mediaId: number; }
    | { type: 'EMBED'; id: number, position: number, content: string }
    | { type: 'GALLERY'; id: number, position: number, images: { mediaId: number; caption: string | null }[] };

export type ContentFormValues = {
    title: string;
    headline: string;
    featuredMediaId: number | null;
    slug: string | null;
    categoryId: number | null;
    authors: {
        authorId: number;
    }[];
    tags: {
        tagId: number;
    }[];
    blocks: ContentBlock[];
};

export type CreateContentRequest = {
    type: string;
}

export type UpdateContentRequest = {
    title: string;
    headline: string;
    featuredMediaId: number | null;
    slug: string | null;
    categoryId: number | null;
    parentId: number | null;
    embedUrl: string | null;
    authors: {
        authorId: number;
    }[];
    tags: {
        tagId: number;
    }[];
    blocks: ContentBlock[];
}

export type ContentsResponse = {
    items: ContentSummary[];
    pagination: Pagination
};

export type NewContentResponse = {
    id: number
}

export type ContentResponse = Content

export type SectionType =
    | 'HIGHLIGHT'
    | 'FEATURED'
    | 'CATEGORY'
    | 'CATEGORY_ROW'
    | 'PHOTOS'
    | 'PODCASTS'
    | 'VIDEOS';

export interface ContentsService {
    fetchAll(params: Query): Promise<ContentsResponse>;

    fetchPublished(params: Query): Promise<ContentsResponse>;

    fetchById(id: number): Promise<ContentResponse>;

    fetchBySlug(slug: string): Promise<ContentResponse>;

    fetchHistoryById(id: number): Promise<ContentHistory>;

    create(content: CreateContentRequest): Promise<NewContentResponse>;

    update(id: number, content: UpdateContentRequest): Promise<void>;

    publish(id: number, comment: string | undefined): Promise<void>;

    submit(id: number): Promise<void>;

    reject(id: number, comment: string | undefined): Promise<void>;

    delete(id: number): Promise<void>;

    archive(id: number): Promise<void>;
}
