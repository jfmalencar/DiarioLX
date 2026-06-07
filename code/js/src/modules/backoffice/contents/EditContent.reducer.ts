import { slugify } from '@/shared/utils/format';
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
    galleryAfterId: undefined,
};

const insertBlock = (blocks: ContentBlock[], newBlock: ContentBlock, afterId?: string,) => {
    if (!afterId) return [...blocks, newBlock];
    const idx = blocks.findIndex((b) => b.id === afterId);
    if (idx === -1) return [...blocks, newBlock];
    return [...blocks.slice(0, idx + 1), newBlock, ...blocks.slice(idx + 1)];
};

const reindex = (blocks: ContentBlock[]) => blocks.map((b, i) => ({ ...b, position: i }));

export const editContentReducer = (state: EditContentState, action: EditContentAction,): EditContentState => {
    const content = state.contentData;
    switch (action.type) {
        case 'init': {
            const content = action.content;
            const [mainAuthor, ...secondaryAuthors] = content.authors.map(a => ({ id: a.id, name: a.name }));
            const [mainTag, ...secondaryTags] = content.tags.map(t => ({ id: t.id, name: t.name }));

            return {
                ...state,
                contentId: content.id,
                isDirty: false,
                contentData: {
                    title: content.title,
                    slug: content.slug,
                    headline: content.headline,
                    category: content.category
                        ? { id: content.category.id, name: content.category.name }
                        : emptyOption,
                    categorySearch: '',
                    mainTag: mainTag ?? emptyOption,
                    mainTagSearch: '',
                    secondaryTags: secondaryTags ?? [],
                    secondaryTagSearch: '',
                    mainAuthor: mainAuthor ?? emptyOption,
                    mainAuthorSearch: '',
                    secondaryAuthors: secondaryAuthors ?? [],
                    secondaryAuthorSearch: '',
                    featuredMedia: content.featuredImage,
                },
                blocks: content.blocks,
            };
        }

        case 'edit':
            if (action.field === 'title' && content.slug === slugify(content.title)) {
                content.slug = slugify(action.value as string);
            }
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
                galleryAfterId: action.afterId,
            };

        case 'close-gallery':
            return {
                ...state,
                galleryMode: null,
                galleryAfterId: undefined,
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
                    galleryAfterId: undefined,
                };
            }

            if (state.galleryMode === 'block') {
                const newBlock: ContentBlock = {
                    id: generateId(),
                    type: 'IMAGE',
                    position: 0, // recalculado pelo reindex
                    media: action.payload,
                    caption: '',
                };

                return {
                    ...state,
                    blocks: reindex(
                        insertBlock(state.blocks, newBlock, state.galleryAfterId),
                    ),
                    galleryMode: null,
                    galleryAfterId: undefined,
                };
            }

            return state;
        }

        case 'add-text-block':
            return {
                ...state,
                blocks: reindex(
                    insertBlock(
                        state.blocks,
                        {
                            id: generateId(),
                            type: 'TEXT',
                            position: 0,
                            content: '<p></p>',
                        },
                        action.afterId,
                    ),
                ),
            };

        case 'add-quote-block':
            return {
                ...state,
                blocks: reindex(
                    insertBlock(
                        state.blocks,
                        {
                            id: generateId(),
                            type: 'QUOTE',
                            position: 0,
                            content: '',
                        },
                        action.afterId,
                    ),
                ),
            };

        case 'add-heading-block':
            return {
                ...state,
                blocks: reindex(
                    insertBlock(
                        state.blocks,
                        {
                            id: generateId(),
                            type: `H${action.level}`,
                            position: 0,
                            content: '',
                        },
                        action.afterId,
                    ),
                ),
            };

        case 'update-content-block':
            return {
                ...state,
                blocks: state.blocks.map((block) =>
                    block.id === action.payload.blockId
                        ? { ...block, content: action.payload.content }
                        : block,
                ),
            };

        case 'remove-block': {
            const exists = state.blocks.some(
                (b) => b.id === action.payload.blockId,
            );
            if (!exists) return state;

            return {
                ...state,
                blocks: reindex(
                    state.blocks.filter((b) => b.id !== action.payload.blockId),
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