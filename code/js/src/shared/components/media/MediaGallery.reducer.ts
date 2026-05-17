import type { MediaGalleryAction, MediaGalleryState } from './MediaGallery.types';

export const initialMediaGalleryState: MediaGalleryState = {
    isUploading: false,
    showUploadForm: false,
    selectedFile: null,
    credits: [],
    creditUser: { id: '', name: '' },
    creditRole: '',
    altText: '',
    uploadProgress: 0,
};

export const mediaGalleryReducer = (state: MediaGalleryState, action: MediaGalleryAction): MediaGalleryState => {
    switch (action.type) {
        case 'set-uploading':
            return {
                ...state,
                isUploading: action.value,
            };

        case 'set-show-upload-form':
            return {
                ...state,
                showUploadForm: action.value,
            };

        case 'set-selected-file':
            return {
                ...state,
                selectedFile: action.file,
            };

        case 'set-credit-user':
            return {
                ...state,
                creditUser: action.user,
            };

        case 'set-credit-role':
            return {
                ...state,
                creditRole: action.role,
            };

        case 'add-credit': {
            if (!state.creditUser.id || !state.creditRole) return state;

            const alreadyExists = state.credits.some(
                (credit) =>
                    credit.userId === state.creditUser.id &&
                    credit.role === state.creditRole,
            );

            if (alreadyExists) return state;

            return {
                ...state,
                credits: [
                    ...state.credits,
                    {
                        userId: state.creditUser.id,
                        userName: state.creditUser.name,
                        role: state.creditRole,
                    },
                ],
                creditUser: { id: '', name: '' },
                creditRole: '',
            };
        }

        case 'remove-credit':
            return {
                ...state,
                credits: state.credits.filter(
                    (_, currentIndex) => currentIndex !== action.index,
                ),
            };

        case 'set-alt-text':
            return {
                ...state,
                altText: action.value,
            };

        case 'set-upload-progress':
            return {
                ...state,
                uploadProgress: action.value,
            };

        case 'reset-upload-form':
            return initialMediaGalleryState;

        default:
            return state;
    }
}
