import type { Query } from '@/shared/types/Query';

export type MediaType = 'image' | 'video' | 'audio';

export type Media = {
    id: string;
    type: MediaType;
    url: string;
    thumbnailUrl: string | null;
    photographer: {
        id: string
        name: string;
        slug: string
    };
    altText: string;
    mimeType: string;
    createdAt: string;
};

export type MediaFormValues = {
    file: File;
    altText: string;
    photographerId: string;
};

export type MediasResponse = {
    medias: Media[];
};

export type SignedUpload = {
    id: string;
    signedUrl: string;
}

export type MediaService = {
    fetchAll: (params: Query) => Promise<MediasResponse>;

    upload: (media: MediaFormValues) => Promise<Media>;

    getSignedUrl: (media: MediaFormValues) => Promise<SignedUpload>;

    completeUpload: (id: string) => Promise<void>;
};
