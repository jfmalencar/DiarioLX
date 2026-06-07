import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';

export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

export type Media = {
    id: string;
    path: string;
    thumbnailPath: string | null;
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
    uploadType: 'CONTENT_IMAGES' | 'CONTENT_VIDEOS' | 'CONTENT_AUDIOS' | 'PROFILE_PICTURES'
    file: File;
    altText: string;
    credits: {
        userId: string;
        role: string;
    }[];
};

export type MediasResponse = {
    items: Media[];
    pagination: Pagination;
};

export type SignedUpload = {
    id: string;
    signedUrl: string;
}

export type MediaService = {
    fetchAll: (params: Query) => Promise<MediasResponse>;

    getSignedUrl: (media: MediaFormValues) => Promise<SignedUpload>;

    completeUpload: (id: string) => Promise<void>;
};
