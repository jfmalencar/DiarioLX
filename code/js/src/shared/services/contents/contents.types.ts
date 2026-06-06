import type { Query } from '@/shared/types/Query';
import type { Media } from '@/shared/services/media/media.types';
import type { Pagination } from '@/shared/types/Pagination';

export type Content = {
    id: string;
    title: string;
    slug: string;
    type: string;
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
    type: string;
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

export type ContentQuoteBlock = ContentBlockBase & {
    type: 'quote';
    content: string;
};

export type ContentTextBlock = ContentBlockBase & {
    type: 'text';
    content: string;
};

export type ContentImageBlock = ContentBlockBase & {
    type: 'image';
    media: Media;
    caption: string | null;
};

export type ContentBlock = ContentTextBlock | ContentQuoteBlock | ContentImageBlock;

export type ContentBlockRequest =
    | { type: 'text'; id: string, position: number, content: string }
    | { type: 'quote'; id: string, position: number, content: string }
    | { type: 'image'; id: string, position: number, mediaId: string; };

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

export type ContentResponse = Content

export interface ContentsService {
    fetchAll(params: Query): Promise<ContentsResponse>;

    fetchOne(slug: string): Promise<ContentResponse>;

    create(content: CreateContentRequest): Promise<number>;

    update(id: number, content: UpdateContentRequest): Promise<void>;

    publish(id: number): Promise<void>;

    delete(id: number): Promise<void>;

    archive(id: number): Promise<void>;
}
