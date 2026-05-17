import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';

export type MediaType = 'image' | 'video' | 'audio';

export type Media = {
    id: string;
    type: MediaType;
    url: string;
    thumbnailUrl: string | null;
    credits: {
        id: string
        name: string;
        role: string
        slug: string
    }[];
    altText: string;
    mimeType: string;
    createdAt: string;
};

export type MediaFormValues = {
    file: File;
    altText: string;
    credits: {
        userId: string;
        role: string;
    }[];
};

export type UserMediaFormValues = {
    file: File;
};

export type MediasResponse = {
    items: Media[];
    pagination: Pagination;
};

export type SignedUpload = {
    id: string;
    signedUrl: string;
}

export type UserSignedUpload = {
    signedUrl: string;
}

export type MediaService = {
    fetchAll: (params: Query) => Promise<MediasResponse>;

    upload: (media: MediaFormValues) => Promise<Media>;

    getSignedUrl: (media: MediaFormValues) => Promise<SignedUpload>;

    getUserSignedUrl: (media: UserMediaFormValues) => Promise<UserSignedUpload>;

    completeUpload: (id: string) => Promise<void>;
};
