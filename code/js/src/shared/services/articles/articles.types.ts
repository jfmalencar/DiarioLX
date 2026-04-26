import type { Query } from '@/shared/types/Query';
import type { Media } from '@/shared/services/media/media.types';

export type Article = {
    id: string;
    title: string;
    slug: string;
    headline: string;
    featuredImage: Media | null;
    blocks: ArticleBlock[];
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

type ArticleBlockBase = {
    id: string;
    position: number;
};

export type ArticleQuoteBlock = ArticleBlockBase & {
    type: 'quote';
    content: string;
};

export type ArticleTextBlock = ArticleBlockBase & {
    type: 'text';
    content: string;
};

export type ArticleImageBlock = ArticleBlockBase & {
    type: 'image';
    media: Media;
    caption: string | null;
};

export type ArticleBlock = ArticleTextBlock | ArticleQuoteBlock | ArticleImageBlock;

export type ArticleBlockRequest =
    | { type: 'text'; id: string, position: number, content: string }
    | { type: 'quote'; id: string, position: number, content: string }
    | { type: 'image'; id: string, position: number, mediaId: string; };

export type ArticleFormValues = {
    id: string;
    title: string;
    slug: string;
    headline: string;
    featuredMediaId: string | null;
    blocks: ArticleBlock[];
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

export type ArticleRequest = {
    id: string;
    title: string;
    slug: string;
    headline: string;
    featuredMediaId: string | null;
    blocks: ArticleBlock[];
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

export type ArticlesResponse = {
    articles: Article[];
};

export type ArticleResponse = {
    article: Article;
}

export interface ArticlesService {
    fetchAll(params: Query): Promise<ArticlesResponse>;

    fetchOne(id: string): Promise<ArticleResponse>;

    create(article: ArticleRequest): Promise<string | undefined>;

    update(id: string, article: ArticleRequest): Promise<void>;

    delete(id: string): Promise<void>;

    archive(id: string): Promise<void>;

    unarchive(id: string): Promise<void>;
}
