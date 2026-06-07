import type { Query } from '@/shared/types/Query';
import type { Pagination } from '@/shared/types/Pagination';

export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

export type Media = {
    id: number;
    path: string;
    thumbnailPath: string | null;
    credits: {
        id: number
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
        userId: number;
        role: string;
    }[];
};

export type MediasResponse = {
    items: Media[];
    pagination: Pagination;
};

export type SignedUpload = {
    id: number;
    signedUrl: string;
}

export type MediaService = {
    fetchAll: (params: Query) => Promise<MediasResponse>;

    getSignedUrl: (media: MediaFormValues) => Promise<SignedUpload>;

    completeUpload: (id: number) => Promise<void>;
};
