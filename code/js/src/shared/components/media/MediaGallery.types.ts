import type { Media } from '@/shared/hooks/useMedia';

export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

export type MediaGalleryProps = {
    mediaType: MediaType;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: Media) => void;
};

export type Credit = {
    userId: number;
    userName: string;
    role: string;
};

export type CreditUser = {
    id: number;
    name: string;
};

export type MediaGalleryState = {
    isUploading: boolean;
    showUploadForm: boolean;
    selectedFile: File | null;
    credits: Credit[];
    creditUser: CreditUser;
    creditRole: string;
    altText: string;
    uploadProgress: number;
};

export type MediaGalleryAction =
    | { type: 'set-uploading'; value: boolean }
    | { type: 'set-show-upload-form'; value: boolean }
    | { type: 'set-selected-file'; file: File | null }
    | { type: 'set-credit-user'; user: CreditUser }
    | { type: 'set-credit-role'; role: string }
    | { type: 'add-credit' }
    | { type: 'remove-credit'; index: number }
    | { type: 'set-alt-text'; value: string }
    | { type: 'set-upload-progress'; value: number }
    | { type: 'reset-upload-form' };