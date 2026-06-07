import type { Query } from '@/shared/types/Query';
import type { Media } from '@/shared/services/media/media.types';
import type { Pagination } from '@/shared/types/Pagination';

export type ContentType = 'ARTICLE' | 'VIDEO' | 'EPISODE' | 'PODCAST';

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
        id: string;
        name: string;
        slug: string;
    }
    authors: {
        id: string;
        slug: string;
        name: string;
    }[]
    tags: {
        id: string;
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
    state: ContentState;
    type: ContentType;
    slug: string;
    featuredImage: string
    category: string
    authors: {
        id: string
        name: string
        slug: string
    }[]
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

export interface ContentsService {
    fetchAll(params: Query): Promise<ContentsResponse>;

    fetchPublished(params: Query): Promise<ContentsResponse>;

    fetchById(id: number): Promise<ContentResponse>;

    fetchBySlug(slug: string): Promise<ContentResponse>;

    create(content: CreateContentRequest): Promise<NewContentResponse>;

    update(id: number, content: UpdateContentRequest): Promise<void>;

    publish(id: number): Promise<void>;

    submit(id: number): Promise<void>;

    delete(id: number): Promise<void>;

    archive(id: number): Promise<void>;
}
