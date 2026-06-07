import type { Query } from '@/shared/types/Query';
import type { Media } from '@/shared/services/media/media.types';
import type { Pagination } from '@/shared/types/Pagination';

export type ContentType = 'ARTICLE' | 'VIDEO' | 'EPISODE' | 'PODCAST';

export type Content = {
    id: string;
    title: string;
    slug: string;
    type: ContentType;
    headline: string;
    featuredImage: Media | null;
    blocks: ContentBlock[];
    category: {
        id: string;
        name: string;
        slug: string;
    }
    authors: {
        authorId: string;
        slug: string;
        name: string;
    }[]
    tags: {
        tagId: string;
        name: string;
        slug: string;
    }[]
    createdAt: string;
    updatedAt: string;
    archivedAt: string | null;
    publishedAt: string | null;
};

export type ContentSummary = {
    id: string;
    title: string;
    type: ContentType;
    slug: string;
    featuredImage: string
    category: string
    authors: string[]
    createdAt: string
    publishedAt: string | null
}

type ContentBlockBase = {
    id: string;
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

export type ContentImageBlock = ContentBlockBase & {
    type: 'IMAGE';
    media: Media;
    caption: string | null;
};

export type ContentBlock =
    | ContentTextBlock
    | ContentQuoteBlock
    | ContentImageBlock
    | ContentH3Block
    | ContentH4Block

export type ContentBlockRequest =
    | { type: 'H3'; id: string, position: number, content: string }
    | { type: 'H4'; id: string, position: number, content: string }
    | { type: 'TEXT'; id: string, position: number, content: string }
    | { type: 'QUOTE'; id: string, position: number, content: string }
    | { type: 'IMAGE'; id: string, position: number, mediaId: string; };

export type ContentFormValues = {
    id: string;
    title: string;
    slug: string;
    type: string;
    headline: string;
    featuredMediaId: string | null;
    blocks: ContentBlock[];
    tags: {
        tagId: string;
    }[];
    authors: {
        authorId: string;
    }[];
    category: {
        id: string;
    };
};

export type ContentRequest = {
    id: string;
    title: string;
    slug: string;
    headline: string;
    type: ContentType;
    featuredMediaId: string | null;
    blocks: ContentBlock[];
    tags: {
        tagId: string;
    }[];
    authors: {
        authorId: string;
    }[];
    category: {
        id: string;
    };
}

export type ContentsResponse = {
    items: ContentSummary[];
    pagination: Pagination
};

export type ContentResponse = Content

export interface ContentsService {
    fetchAll(params: Query): Promise<ContentsResponse>;

    fetchPublished(params: Query): Promise<ContentsResponse>;

    fetchOne(id: string): Promise<ContentResponse>;

    create(content: ContentRequest): Promise<string | undefined>;

    update(id: string, content: ContentRequest): Promise<void>;

    delete(id: string): Promise<void>;

    archive(id: string): Promise<void>;

    unarchive(id: string): Promise<void>;
}
