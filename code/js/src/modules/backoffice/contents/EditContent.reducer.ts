import { slugify } from '@/shared/utils/format';
import type { EditContentState, EditContentAction, Option } from './EditContent.types';
import type { ContentBlock } from '@/shared/services/contents/contents.types';

const generateId = () => parseInt(crypto.randomUUID().slice(0, 8), 16);

const emptyOption: Option = {
    id: 0,
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
        parent: emptyOption,
        parentSearch: '',
        mainTag: emptyOption,
        mainTagSearch: '',
        secondaryTags: [],
        secondaryTagSearch: '',
        mainAuthor: emptyOption,
        mainAuthorSearch: '',
        secondaryAuthors: [],
        secondaryAuthorSearch: '',
        featuredMedia: null,
        embedUrl: '',
    },
    blocks: [],
    galleryMode: null,
    galleryAfterId: undefined,
};

const insertBlock = (blocks: ContentBlock[], newBlock: ContentBlock, afterId?: number) => {
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
                    type: content.type,
                    title: content.title,
                    slug: content.slug,
                    headline: content.headline,
                    category: content.category
                        ? { id: content.category.id, name: content.category.name }
                        : emptyOption,
                    categorySearch: '',
                    parent: content.parent
                        ? { id: content.parent.id, name: content.parent.title }
                        : emptyOption,
                    parentSearch: '',
                    mainTag: mainTag ?? emptyOption,
                    mainTagSearch: '',
                    secondaryTags: secondaryTags ?? [],
                    secondaryTagSearch: '',
                    mainAuthor: mainAuthor ?? emptyOption,
                    mainAuthorSearch: '',
                    secondaryAuthors: secondaryAuthors ?? [],
                    secondaryAuthorSearch: '',
                    featuredMedia: content.featuredImage,
                    embedUrl: content.embedUrl ?? '',
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
                galleryTargetBlockId: undefined,
            };

        case 'open-gallery-add-more':
            return {
                ...state,
                galleryMode: 'gallery',
                galleryAfterId: undefined,
                galleryTargetBlockId: action.blockId,
            };

        case 'close-gallery':
            return {
                ...state,
                galleryMode: null,
                galleryAfterId: undefined,
                galleryTargetBlockId: undefined,
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

            if (state.galleryMode === 'block' || state.galleryMode === 'video-block' || state.galleryMode === 'audio-block') {
                const newBlock: ContentBlock = {
                    id: generateId(),
                    type: 'MEDIA',
                    position: 0, // recalculado pelo reindex
                    media: action.payload,
                    caption: null,
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

        case 'select-media-many': {
            const newImages = action.payload.map((media) => ({ media, caption: null }));

            // Append to an existing gallery block when "adicionar mais" was used.
            if (state.galleryTargetBlockId !== undefined) {
                return {
                    ...state,
                    blocks: state.blocks.map((block) =>
                        block.id === state.galleryTargetBlockId && block.type === 'GALLERY'
                            ? { ...block, images: [...block.images, ...newImages] }
                            : block,
                    ),
                    galleryMode: null,
                    galleryAfterId: undefined,
                    galleryTargetBlockId: undefined,
                };
            }

            const newBlock: ContentBlock = {
                id: generateId(),
                type: 'GALLERY',
                position: 0, // recalculado pelo reindex
                images: newImages,
            };

            return {
                ...state,
                blocks: reindex(insertBlock(state.blocks, newBlock, state.galleryAfterId)),
                galleryMode: null,
                galleryAfterId: undefined,
                galleryTargetBlockId: undefined,
            };
        }

        case 'update-gallery-caption':
            return {
                ...state,
                blocks: state.blocks.map((block) =>
                    block.id === action.payload.blockId && block.type === 'GALLERY'
                        ? {
                            ...block,
                            images: block.images.map((image, index) =>
                                index === action.payload.imageIndex
                                    ? { ...image, caption: action.payload.caption }
                                    : image,
                            ),
                        }
                        : block,
                ),
            };

        case 'remove-gallery-image':
            return {
                ...state,
                blocks: state.blocks.map((block) =>
                    block.id === action.payload.blockId && block.type === 'GALLERY'
                        ? {
                            ...block,
                            images: block.images.filter((_, index) => index !== action.payload.imageIndex),
                        }
                        : block,
                ),
            };

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

        case 'add-embed-block':
            return {
                ...state,
                blocks: reindex(
                    insertBlock(
                        state.blocks,
                        {
                            id: generateId(),
                            type: 'EMBED',
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

        default:
            return state;
    }
};
