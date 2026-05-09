import type { EditArticleState, EditArticleAction, Option } from './EditArticle.types';
import type { ArticleBlock } from '@/shared/services/articles/articles.types';

const generateId = () => crypto.randomUUID().toString();

const emptyOption: Option = {
    id: '',
    name: '',
};

export const initialState: EditArticleState = {
    tag: 'editing',
    articleData: {
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

export const editArticleReducer = (state: EditArticleState, action: EditArticleAction,): EditArticleState => {
    const article = state.articleData;
    switch (action.type) {
        case 'edit':
            return {
                ...state,
                articleData: {
                    ...article,
                    [action.field]: action.value,
                },
            };

        case 'select-single':
            return {
                ...state,
                articleData: {
                    ...article,
                    [action.field]: action.option,
                    [action.searchField]: '',
                },
            };

        case 'clear-single':
            return {
                ...state,
                articleData: {
                    ...article,
                    [action.field]: emptyOption,
                    [action.searchField]: '',
                },
            };

        case 'add-secondary': {
            const currentList = article[action.field];
            if (currentList.some((item) => item.id === action.option.id)) {
                return state;
            }

            return {
                ...state,
                articleData: {
                    ...article,
                    [action.field]: [...currentList, action.option],
                    [action.searchField]: '',
                },
            };
        }

        case 'remove-secondary':
            return {
                ...state,
                articleData: {
                    ...article,
                    [action.field]: article[action.field].filter(
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
                    articleData: {
                        ...article,
                        featuredMedia: action.payload,
                    },
                    galleryMode: null,
                };
            }

            if (state.galleryMode === 'block') {
                const newBlock: ArticleBlock = {
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

        default:
            return state;
    }
};