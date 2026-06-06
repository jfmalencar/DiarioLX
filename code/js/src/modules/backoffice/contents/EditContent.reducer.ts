import type { EditContentState, EditContentAction, Option } from './EditContent.types';
import type { ContentBlock } from '@/shared/services/contents/contents.types';

const generateId = () => crypto.randomUUID().toString();

const emptyOption: Option = {
    id: '',
    name: '',
};

export const initialState: EditContentState = {
    tag: 'editing',
    contentId: null,
    isDirty: false,
    contentData: {
        title: '',
        slug: '',
        headline: '',
        category: emptyOption,
        categorySearch: '',
        mainTag: emptyOption,
        mainTagSearch: '',
        secondaryTags: [],
        secondaryTagSearch: '',
        mainAuthor: emptyOption,
        mainAuthorSearch: '',
        secondaryAuthors: [],
        secondaryAuthorSearch: '',
        featuredMedia: null,
    },
    blocks: [],
    galleryMode: null,
};

export const editContentReducer = (state: EditContentState, action: EditContentAction,): EditContentState => {
    const content = state.contentData;
    switch (action.type) {
        case 'edit':
            return {
                ...state,
                contentData: {
                    ...content,
                    [action.field]: action.value,
                },
            };

        case 'select-single':
            return {
                ...state,
                contentData: {
                    ...content,
                    [action.field]: action.option,
                    [action.searchField]: '',
                },
            };

        case 'clear-single':
            return {
                ...state,
                contentData: {
                    ...content,
                    [action.field]: emptyOption,
                    [action.searchField]: '',
                },
            };

        case 'add-secondary': {
            const currentList = content[action.field];
            if (currentList.some((item) => item.id === action.option.id)) {
                return state;
            }

            return {
                ...state,
                contentData: {
                    ...content,
                    [action.field]: [...currentList, action.option],
                    [action.searchField]: '',
                },
            };
        }

        case 'remove-secondary':
            return {
                ...state,
                contentData: {
                    ...content,
                    [action.field]: content[action.field].filter(
                        (item) => item.id !== action.id,
                    ),
                },
            };

        case 'open-gallery':
            return {
                ...state,
                galleryMode: action.payload,
            };

        case 'close-gallery':
            return {
                ...state,
                galleryMode: null,
            };

        case 'select-media': {
            if (state.galleryMode === 'featured') {
                return {
                    ...state,
                    contentData: {
                        ...content,
                        featuredMedia: action.payload,
                    },
                    galleryMode: null,
                };
            }

            if (state.galleryMode === 'block') {
                const newBlock: ContentBlock = {
                    id: generateId(),
                    type: 'image',
                    position: state.blocks.length,
                    media: action.payload,
                    caption: '',
                };

                return {
                    ...state,
                    blocks: [...state.blocks, newBlock],
                    galleryMode: null,
                };
            }

            return state;
        }

        case 'add-text-block':
            return {
                ...state,
                blocks: [
                    ...state.blocks,
                    {
                        id: generateId(),
                        type: 'text',
                        position: state.blocks.length,
                        content: '<p></p>',
                    },
                ],
            };

        case 'update-text-block':
            return {
                ...state,
                blocks: state.blocks.map((block) =>
                    block.id === action.payload.blockId && block.type === 'text'
                        ? { ...block, content: action.payload.content }
                        : block,
                ),
            };

        case 'remove-block': {
            const blockToRemove = state.blocks.find(
                (b) => b.id === action.payload.blockId,
            );

            if (!blockToRemove) return state;

            return {
                ...state,
                blocks: state.blocks
                    .filter((b) => b.id !== action.payload.blockId)
                    .map((b) =>
                        b.position > blockToRemove.position
                            ? { ...b, position: b.position - 1 }
                            : b,
                    ),
            };
        }

        case 'set-content-id':
            return {
                ...state,
                contentId: action.payload,
            };

        case 'set-dirty':
            return {
                ...state,
                isDirty: action.payload,
            };

        case 'load-content':
            return {
                ...state,
                contentId: action.payload.id,
                isDirty: false,
                contentData: {
                    title: action.payload.title,
                    slug: action.payload.slug,
                    headline: action.payload.headline,
                    category: action.payload.category,
                    categorySearch: '',
                    mainTag: action.payload.mainTag,
                    mainTagSearch: '',
                    secondaryTags: action.payload.secondaryTags,
                    secondaryTagSearch: '',
                    mainAuthor: action.payload.mainAuthor,
                    mainAuthorSearch: '',
                    secondaryAuthors: action.payload.secondaryAuthors,
                    secondaryAuthorSearch: '',
                    featuredMedia: action.payload.featuredMedia,
                },
                blocks: action.payload.blocks,
            };

        default:
            return state;
    }
};