import { useReducer, useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';

import type { Editor } from '@tiptap/react';
import {
    Upload,
    EditIcon,
    Trash2,
} from 'lucide-react';

import { RichTextToolbar } from '@/shared/components/richtext/RichTextToolbar';
import { RichTextBlock } from '@/shared/components/richtext/RichTextBlock';
import { FieldSection } from '@/shared/components/inputs/FieldSection';
import { UnderlineInput } from '@/shared/components/inputs/UnderlineInput';
import { MediaGallery } from '@/shared/components/media/MediaGallery';
import { EmbedPlayer } from '@/shared/components/EmbedPlayer';
import { embedSrc, detectProvider } from '@/shared/utils/embed';
import { GalleryBlockEditor } from './GalleryBlockEditor';
import { SearchField } from '@/shared/components/inputs/SearchField';
import { Pill } from '@/shared/components/Pill';
import { Alert } from '@/shared/components/Alert';
import { ConfirmModal, type ModalConfig } from '@/shared/components/modals/ConfirmModal';

import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { useCategories } from '@/shared/hooks/useCategories';
import { useContents } from '@/shared/hooks/useContents';
import { useTags } from '@/shared/hooks/useTags';
import { useUsers } from '@/shared/hooks/useUsers';
import { useI18n } from '@/shared/hooks/useI18n';
import { usePath } from '@/shared/hooks/usePath';
import { useSnackbar } from '@/shared/hooks/useSnackbar';

import type { ContentEditingInput, ImageBlockProps } from './EditContent.types';
import { editContentReducer, initialState } from './EditContent.reducer';

import icon from '@/assets/icon.svg';
import type { ContentType, ContentBlock } from '@/shared/services/contents/contents.types';

import { AddMenu } from './AddMenu';
import { PublishModal } from './PublishModal';
import { slugify } from '@/shared/utils/format';

const useDebouncedSearch = (value: string, fetchFn: (args: { query: string }) => Promise<void>) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            const query = value.trim().toLowerCase();
            fetchFn({ query });
        }, 400);
        return () => clearTimeout(timeout);
    }, [value, fetchFn]);
};

const ImageBlock = ({ url, alt = '', width = 600 }: ImageBlockProps) => (
    <div className='mb-2'>
        <img src={url} alt={alt} className='img-fluid rounded' style={{ width }} />
    </div>
);

const VideoBlock = ({ url }: { url: string }) => (
    <div className='mb-4'>
        <video src={`${url}#t=1`} controls preload='metadata' className='w-100 rounded' />
    </div>
);

type Variant = 'paragraph' | 'quote' | 'h3' | 'h4';

const getVariant = (block: ContentBlock): Variant => {
    switch (block.type) {
        case 'QUOTE': return 'quote';
        case 'H3': return 'h3';
        case 'H4': return 'h4';
        default: return 'paragraph';
    }
};

const requiredEmbedProvider = (type?: ContentType): 'youtube' | 'spotify' | null =>
    type === 'VIDEO' ? 'youtube' : type === 'EPISODE' ? 'spotify' : null;

const hasValidEmbed = (embedUrl: string, type?: ContentType): boolean => {
    const required = requiredEmbedProvider(type);
    return required !== null && detectProvider(embedUrl) === required;
};

const canPublish = (content: ContentEditingInput, type?: ContentType): boolean =>
    content.title.trim() !== '' &&
    content.slug.trim() !== '' &&
    (type === 'EPISODE' ? content.parent.id > 0 : content.category.id > 0) &&
    (content.featuredMedia !== null || hasValidEmbed(content.embedUrl, type)) &&
    content.mainAuthor.id > 0 &&
    content.mainTag.id > 0;

export const EditContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const { buildMediaUrl } = usePath();
    const { t } = useI18n();
    const { user } = useAuthentication()

    const { fetchById, create, update, loading, publish, submit, delete: deleteContent } = useContents();
    const { fetchAll: fetchPodcasts, contents: podcasts } = useContents();
    const { fetchAll: fetchCategories, categories } = useCategories();
    const { fetchAll: fetchAuthors, users } = useUsers();
    const { fetchAll: fetchTags, tags } = useTags();
    const { showSnackbar } = useSnackbar();

    const [state, dispatch] = useReducer(editContentReducer, initialState);
    const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
    const [openConfirmaModal, setOpenConfirmModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

    const canSelectMainAuthor = user?.features?.includes("select-main-author")
    const canManagePodcasts = user?.features?.includes("manage-podcasts")

    const content = state.contentData;
    const type = content.type || (searchParams.get('type') as ContentType);

    if (type === 'PODCAST' && !canManagePodcasts) {
        navigate('/backoffice/contents', { replace: true });
    }

    useEffect(() => {
        const load = async () => {
            if (params.id && params.id !== 'new') {
                await fetchById(Number(params.id)).then((content) => {
                    if (content) {
                        dispatch({ type: 'init', content });
                    } else {
                        navigate('/backoffice/contents/new', { replace: true });
                    }
                });
            }
            if (user && !canSelectMainAuthor) {
                dispatch({ type: 'select-single', field: 'mainAuthor', searchField: 'mainAuthorSearch', option: { id: user.userId, name: user.firstName } })
            }
        }
        load();
    }, [location.state, fetchById, params.id, navigate, user, canSelectMainAuthor]);

    const authors = useMemo(
        () => users.map((user) => ({ id: user.userId, name: `${user.firstName} ${user.lastName}` })),
        [users],
    );

    const fetchPodcastsByQuery = useCallback(
        async ({ query }: { query: string }) => { await fetchPodcasts({ query, type: 'PODCAST' }); },
        [fetchPodcasts],
    );

    const podcastOptions = useMemo(
        () => podcasts.map((p) => ({ id: p.id, name: p.title })),
        [podcasts],
    );

    useDebouncedSearch(content.categorySearch, fetchCategories);
    useDebouncedSearch(content.parentSearch, fetchPodcastsByQuery);
    useDebouncedSearch(content.mainTagSearch, fetchTags);
    useDebouncedSearch(content.secondaryTagSearch, fetchTags);
    useDebouncedSearch(content.mainAuthorSearch, fetchAuthors);
    useDebouncedSearch(content.secondaryAuthorSearch, fetchAuthors);

    const filteredTags = tags.filter(
        (tag) => tag.id !== content.mainTag.id && !content.secondaryTags.some((t) => t.id === tag.id),
    );

    const filteredAuthors = authors.filter(
        (author) => author.id !== content.mainAuthor.id && !content.secondaryAuthors.some((a) => a.id === author.id),
    );

    const handleBlurEditor = (event: FocusEvent) => {
        const toolbar = document.getElementById('richtext-toolbar');
        const isClickInsideToolbar = toolbar?.contains(event.relatedTarget as Node) ?? false;
        if (isClickInsideToolbar) return;
        setActiveEditor(null);
    };

    // Ensures content is created and saved, returns the id or null on failure
    const ensureSaved = useCallback(async (): Promise<number | null> => {
        let id = state.contentId;

        if (!id) {
            const createRes = await create({ type });
            if (!createRes.ok || createRes.data == null) {
                showSnackbar(createRes.ok ? t('posts.create_error') : createRes.error, 'error');
                return null;
            }
            id = createRes.data;
            dispatch({ type: 'set-content-id', payload: id });
        }

        const res = await update(id, {
            title: content.title,
            headline: content.headline,
            featuredMediaId: content.featuredMedia ? content.featuredMedia.id : null,
            slug: content.slug,
            categoryId: content.category.id ? content.category.id : null,
            parentId: type === 'EPISODE' && content.parent.id ? content.parent.id : null,
            embedUrl: hasValidEmbed(content.embedUrl, type) ? content.embedUrl.trim() : null,
            tags: [
                ...(content.mainTag.id ? [{ tagId: content.mainTag.id }] : []),
                ...content.secondaryTags.map((tag) => ({ tagId: tag.id })),
            ],
            authors: [
                ...(content.mainAuthor.id ? [{ authorId: content.mainAuthor.id }] : []),
                ...content.secondaryAuthors.map((author) => ({ authorId: author.id })),
            ],
            blocks: state.blocks,
        });

        if (!res.ok) {
            showSnackbar(res.error, 'error');
            return null;
        }

        return id;
    }, [state, content, type, create, update, showSnackbar, t]);

    const handleUpdate = async () => {
        const id = await ensureSaved();
        if (id) {
            showSnackbar(t('posts.save_success'), 'success');
            dispatch({ type: 'set-dirty', payload: false });
        }
    };

    const handleSubmit = async (mode: 'publish' | 'review', publishedAt?: number) => {
        if (!canPublish(content, type)) {
            setOpenConfirmModal(false)
            showSnackbar(t('posts.required_fields', { field: type === 'EPISODE' ? t('posts.field.podcast') : t('posts.field.category') }), 'error');
            return;
        }

        const id = await ensureSaved();
        if (!id) return;

        if (mode === 'publish') {
            const res = await publish(id, undefined, publishedAt);
            if (!res.ok) {
                setOpenConfirmModal(false)
                showSnackbar(res.error, 'error');
                return;
            }
            showSnackbar(t('contents.publish_success'), 'success');
            navigate(!publishedAt || publishedAt < Math.floor(Date.now() / 1000) ? `/p/${content.slug}` : '/backoffice/contents?tab=scheduled');
        } else {
            const res = await submit(id);
            if (!res.ok) {
                setOpenConfirmModal(false)
                showSnackbar(res.error, 'error');
                return;
            }
            showSnackbar(t('posts.review_requested_success'), 'success');
            navigate('/backoffice/contents?tab=pending');
        }
    };

    const deleteConfig: ModalConfig = {
        title: t('posts.delete_title'),
        subtitle: t('posts.delete_subtitle'),
        alert: t('posts.delete_alert'),
        confirmLabel: t('common.delete'),
        action: deleteContent,
        getRedirect: () => '/backoffice/contents',
        variant: 'danger',
    };

    const handleConfirmDelete = async () => {
        if (!state.contentId) return;
        const res = await deleteContent(state.contentId);
        if (!res.ok) {
            showSnackbar(res.error, 'error');
            return;
        }
        setOpenDeleteModal(false);
        navigate('/backoffice/contents');
    };

    return (
        <div className='d-flex flex-column vh-100 bg-light'>
            <header className='bg-black text-white border-bottom border-secondary position-sticky top-0'>
                <div className='container-fluid px-5'>
                    <div className='d-flex align-items-center justify-content-between' style={{ minHeight: 64 }}>
                        <div className='d-flex align-items-center' style={{ width: 320 }}>
                            <Link to='/backoffice/contents' className='d-flex align-items-center text-white text-decoration-none'>
                                <img src={icon} alt='Ícone do DiárioLX' style={{ width: 28, height: 28 }} className='me-4' />
                            </Link>
                            <RichTextToolbar key={activeEditor?.instanceId} editor={loading ? null : activeEditor} />
                        </div>
                        <div className='fw-semibold' style={{ fontSize: '1.15rem' }}>
                            {t(`posts.${params.id === 'new' ? 'create' : 'edit'}.${type?.toLowerCase()}`)}
                        </div>
                        <div className='d-flex align-items-center gap-4' style={{ width: 320 }}>
                            <div className='border-start border-white opacity-75' style={{ height: 30 }} />
                            <div>{t('posts.settings')}</div>
                        </div>
                    </div>
                </div>
            </header>
            <main className='d-flex flex-grow-1 overflow-hidden ps-5' style={{ minHeight: 0 }}>
                <div style={{ width: 320, flexShrink: 1, minWidth: 0 }} />
                <div className='flex-grow-1 overflow-y-auto py-4 pe-4 ps-5' style={{ minWidth: 0, maxWidth: 'calc(100vw - 610px)' }}>
                    {content.state === 'APPROVED' && (
                        <div className='mb-4'>
                            <Alert variant='warning' title={t('posts.published_warning_title')}>
                                {t('posts.published_warning_body')}
                            </Alert>
                        </div>
                    )}
                    <h1>
                        <textarea
                            className='font-noticia form-control border-0 bg-transparent shadow-none px-0 mb-3 resize-none overflow-hidden'
                            style={{ minHeight: 0, fontSize: '1.75rem', resize: 'none', fontWeight: 500 }}
                            disabled={loading}
                            value={content.title}
                            placeholder={t('posts.title_placeholder')}
                            onChange={(e) => dispatch({ type: 'edit', field: 'title', value: e.target.value })}
                            onInput={(e) => {
                                const el = e.currentTarget;
                                el.style.height = 'auto';
                                el.style.height = `${el.scrollHeight}px`;
                            }}
                            rows={1}
                        />
                    </h1>
                    <h2>
                        <textarea
                            className='font-noticia form-control border-0 bg-transparent shadow-none px-0 mb-3 resize-none overflow-hidden'
                            disabled={loading}
                            style={{ minHeight: 0, fontSize: '1.25rem', resize: 'none' }}
                            placeholder={t('posts.headline_placeholder')}
                            value={content.headline}
                            onChange={(e) => dispatch({ type: 'edit', field: 'headline', value: e.target.value })}
                            onInput={(e) => {
                                const el = e.currentTarget;
                                el.style.height = 'auto';
                                el.style.height = `${el.scrollHeight}px`;
                            }}
                            rows={1}
                        />
                    </h2>
                    {content.featuredMedia ? (
                        <div className='mb-4 position-relative' style={{ width: 600 }}>
                            {content.featuredMedia.mimeType.startsWith('video') ? (
                                <VideoBlock url={buildMediaUrl(content.featuredMedia.path)} />
                            ) : (
                                <ImageBlock url={buildMediaUrl(content.featuredMedia.path)} alt={content.featuredMedia.altText} />
                            )}
                            <button
                                type='button'
                                className='btn btn-dark position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center'
                                style={{ width: 36, height: 36 }}
                                onClick={() => dispatch({ type: 'open-gallery', payload: 'featured' })}
                            >
                                <EditIcon size={24} />
                            </button>
                        </div>
                    ) : (type === 'VIDEO' || type === 'EPISODE') && hasValidEmbed(content.embedUrl, type) && embedSrc(content.embedUrl) ? (
                        <div className='mb-4 position-relative' style={{ maxWidth: 600 }}>
                            <EmbedPlayer url={content.embedUrl} />
                            <button
                                type='button'
                                className='btn btn-dark position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center'
                                style={{ width: 36, height: 36 }}
                                onClick={() => dispatch({ type: 'edit', field: 'embedUrl', value: '' })}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className='mb-3'>
                            <button
                                type='button'
                                disabled={loading}
                                className='btn btn-outline-dark w-100 d-flex align-items-center justify-content-between rounded-0 px-2 mb-2'
                                style={{ height: 48 }}
                                onClick={() => dispatch({ type: 'open-gallery', payload: 'featured' })}
                            >
                                {type === 'VIDEO' ? (
                                    <span className='fs-5'>{t('posts.video')}</span>
                                ) : type === 'EPISODE' ? (
                                    <span className='fs-5'>{t('posts.episode_audio')}</span>
                                ) :
                                    <span className='fs-5'>{t('posts.featured_image')}</span>
                                }
                                <Upload size={28} />
                            </button>
                            {(type === 'VIDEO' || type === 'EPISODE') && (
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder={type === 'VIDEO' ? t('posts.paste_youtube') : t('posts.paste_spotify')}
                                    value={content.embedUrl}
                                    disabled={loading}
                                    onChange={(e) => dispatch({ type: 'edit', field: 'embedUrl', value: e.currentTarget.value })}
                                />
                            )}
                            {(type === 'VIDEO' || type === 'EPISODE') && content.embedUrl.trim() !== '' && !hasValidEmbed(content.embedUrl, type) && (
                                <div className='form-text text-danger'>
                                    {type === 'VIDEO' ? t('posts.youtube_hint') : t('posts.spotify_hint')}
                                </div>
                            )}
                        </div>
                    )}
                    {state.blocks.map((block) => (
                        <div key={block.id} className='ej-block'>
                            <div className='ej-block__gutter'>
                                {type !== 'PHOTO_ESSAY' && (
                                    <AddMenu afterId={block.id} dispatch={dispatch} loading={loading} inline />
                                )}
                                <button
                                    type='button'
                                    disabled={loading}
                                    className='ej-block__delete btn btn-sm p-0 d-flex align-items-center justify-content-center'
                                    aria-label={t('posts.remove_block')}
                                    onClick={() => dispatch({ type: 'remove-block', payload: { blockId: block.id } })}
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                            <div className='ej-block__content'>
                                {block.type === 'MEDIA' ? (
                                    block.media.mimeType.startsWith('video') ? (
                                        <VideoBlock url={buildMediaUrl(block.media.path)} />
                                    ) : block.media.mimeType.startsWith('audio') ? (
                                        <audio src={buildMediaUrl(block.media.path)} controls className='w-100' />
                                    ) : (
                                        <ImageBlock url={buildMediaUrl(block.media.path)} alt={block.media.altText} />
                                    )
                                ) : block.type === 'GALLERY' ? (
                                    <GalleryBlockEditor block={block} dispatch={dispatch} loading={loading} />
                                ) : block.type === 'EMBED' ? (
                                    <div className='border rounded p-3'>
                                        <input
                                            type='text'
                                            className='form-control mb-2'
                                            placeholder={t('posts.paste_embed')}
                                            value={block.content}
                                            disabled={loading}
                                            onChange={(e) => dispatch({ type: 'update-content-block', payload: { blockId: block.id, content: e.currentTarget.value } })}
                                        />
                                        {embedSrc(block.content) && <EmbedPlayer url={block.content} />}
                                    </div>
                                ) : (
                                    <RichTextBlock
                                        value={block.content}
                                        variant={getVariant(block)}
                                        disabled={loading}
                                        onChange={(html) => dispatch({ type: 'update-content-block', payload: { blockId: block.id, content: html } })}
                                        onFocusEditor={(editor) => setActiveEditor(editor)}
                                        onBlurEditor={(event) => handleBlurEditor(event)}
                                        placeholder={t('posts.start_writing')}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    {type === 'PHOTO_ESSAY' ? (
                        !state.blocks.some((b) => b.type === 'GALLERY') && (
                            <button
                                type='button'
                                disabled={loading}
                                className='btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 rounded-0 my-2'
                                style={{ height: 56 }}
                                onClick={() => dispatch({ type: 'open-gallery', payload: 'gallery' })}
                            >
                                <Upload size={22} /> {t('posts.add_photos')}
                            </button>
                        )
                    ) : (
                        <AddMenu dispatch={dispatch} loading={loading} />
                    )}
                </div>
                <div className='pt-4 border-start border-dark' style={{ width: 366, flexShrink: 0, overflowY: 'auto' }}>
                    <form onSubmit={handleUpdate} className='bg-transparent'>
                        <div className='px-4'>
                            <FieldSection title={t('common.slug')}>
                                <UnderlineInput
                                    value={content.slug}
                                    name='slug'
                                    disabled={loading}
                                    placeholder={t('posts.slug_placeholder', { type: type?.toLocaleLowerCase() ?? '' })}
                                    onChange={(e) => dispatch({ type: 'edit', field: 'slug', value: slugify(e.currentTarget.value) })}
                                    dataTestId='content-slug-input'
                                />
                            </FieldSection>
                            {type === 'EPISODE' ? (
                                <FieldSection title={t('posts.field.podcast')}>
                                    {content.parent.id ? (
                                        <Pill label={content.parent.name} onRemove={() => dispatch({ type: 'clear-single', field: 'parent', searchField: 'parentSearch' })} />
                                    ) : (
                                        <SearchField
                                            value={content.parentSearch}
                                            name='parentSearch'
                                            options={podcastOptions}
                                            placeholder={t('posts.search_podcast')}
                                            onSearch={(e) => dispatch({ type: 'edit', field: 'parentSearch', value: e.currentTarget.value })}
                                            onSelect={(option) => dispatch({ type: 'select-single', field: 'parent', searchField: 'parentSearch', option })}
                                        />
                                    )}
                                </FieldSection>
                            ) : (
                                <FieldSection title={t('posts.field.category')}>
                                    {content.category.id ? (
                                        <Pill label={content.category.name} onRemove={() => dispatch({ type: 'clear-single', field: 'category', searchField: 'categorySearch' })} />
                                    ) : (
                                        <SearchField
                                            value={content.categorySearch}
                                            name='categorySearch'
                                            options={categories}
                                            placeholder={t('posts.search_category')}
                                            onSearch={(e) => dispatch({ type: 'edit', field: 'categorySearch', value: e.currentTarget.value })}
                                            onSelect={(option) => dispatch({ type: 'select-single', field: 'category', searchField: 'categorySearch', option })}
                                        />
                                    )}
                                </FieldSection>
                            )}
                            <FieldSection title={t('posts.main_tag')}>
                                {content.mainTag.id ? (
                                    <Pill label={content.mainTag.name} onRemove={() => dispatch({ type: 'clear-single', field: 'mainTag', searchField: 'mainTagSearch' })} />
                                ) : (
                                    <SearchField
                                        disabled={loading}
                                        value={content.mainTagSearch}
                                        name='mainTagSearch'
                                        options={filteredTags}
                                        placeholder={t('posts.search_main_tag')}
                                        onSearch={(e) => dispatch({ type: 'edit', field: 'mainTagSearch', value: e.currentTarget.value })}
                                        onSelect={(option) => dispatch({ type: 'select-single', field: 'mainTag', searchField: 'mainTagSearch', option })}
                                    />
                                )}
                            </FieldSection>
                            <FieldSection title={t('posts.secondary_tags')} optional={true}>
                                <div className='d-flex flex-wrap gap-2 mb-2'>
                                    {content.secondaryTags.map((tag) => (
                                        <Pill key={tag.id} label={tag.name} onRemove={() => dispatch({ type: 'remove-secondary', field: 'secondaryTags', id: tag.id })} />
                                    ))}
                                </div>
                                <SearchField
                                    disabled={loading}
                                    value={content.secondaryTagSearch}
                                    name='secondaryTagSearch'
                                    options={filteredTags}
                                    placeholder={t('posts.search_secondary_tag')}
                                    onSearch={(e) => dispatch({ type: 'edit', field: 'secondaryTagSearch', value: e.currentTarget.value })}
                                    onSelect={(option) => dispatch({ type: 'add-secondary', field: 'secondaryTags', searchField: 'secondaryTagSearch', option })}
                                />
                            </FieldSection>
                            <FieldSection title={t('posts.main_author')}>
                                {content.mainAuthor.id ? (
                                    <Pill label={content.mainAuthor.name} onRemove={canSelectMainAuthor ? () => dispatch({ type: 'clear-single', field: 'mainAuthor', searchField: 'mainAuthorSearch' }) : undefined} />
                                ) : (
                                    <SearchField
                                        disabled={loading}
                                        value={content.mainAuthorSearch}
                                        name='mainAuthorSearch'
                                        options={filteredAuthors}
                                        placeholder={t('posts.search_main_author')}
                                        onSearch={(e) => dispatch({ type: 'edit', field: 'mainAuthorSearch', value: e.currentTarget.value })}
                                        onSelect={(option) => dispatch({ type: 'select-single', field: 'mainAuthor', searchField: 'mainAuthorSearch', option })}
                                    />
                                )}
                            </FieldSection>
                            <FieldSection title={t('posts.secondary_authors')} optional={true}>
                                <div className='d-flex flex-wrap gap-2 mb-2'>
                                    {content.secondaryAuthors.map((author) => (
                                        <Pill key={author.id} label={author.name} onRemove={() => dispatch({ type: 'remove-secondary', field: 'secondaryAuthors', id: author.id })} />
                                    ))}
                                </div>
                                <SearchField
                                    disabled={loading}
                                    value={content.secondaryAuthorSearch}
                                    name='secondaryAuthorSearch'
                                    options={filteredAuthors}
                                    placeholder={t('posts.search_secondary_author')}
                                    onSearch={(e) => dispatch({ type: 'edit', field: 'secondaryAuthorSearch', value: e.currentTarget.value })}
                                    onSelect={(option) => dispatch({ type: 'add-secondary', field: 'secondaryAuthors', searchField: 'secondaryAuthorSearch', option })}
                                />
                            </FieldSection>
                        </div>
                        <div
                            className='d-flex gap-2 bg-light p-3 position-sticky bottom-0 start-0 end-0'
                            style={{ boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.08)' }}
                        >
                            <button
                                type='button'
                                className='btn w-40 flex-grow-1'
                                onClick={() => setOpenDeleteModal(true)}
                                disabled={!state.contentId || loading}
                                style={{ backgroundColor: 'rgb(255, 0, 0)', height: 40, width: 10 }}
                            >
                                <svg width="40" height="100%" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF" strokeWidth="1.5">
                                    <path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9" fill="#ffffff"></path>
                                    <path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9H20Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M21 6H15.375M3 6H8.625M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6H15.375" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </button>
                            <button
                                type='button'
                                className='btn w-40 flex-grow-1'
                                disabled={loading}
                                onClick={handleUpdate}
                                style={{ height: 40, border: '1px black solid' }}
                            >
                                {t('common.save')}
                            </button>
                            <button
                                type='button'
                                className='btn btn-dark w-40 flex-grow-1'
                                disabled={loading}
                                onClick={() => setOpenConfirmModal(true)}
                                style={{ height: 40 }}
                            >
                                {t('common.publish')}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <PublishModal
                isOpen={openConfirmaModal}
                onClose={() => setOpenConfirmModal(false)}
                content={{
                    title: content.title,
                    category: content.category.name,
                    featured: content.featuredMedia,
                    authors: [content.mainAuthor.name, ...content.secondaryAuthors.map((a) => a.name)],
                    publishedAt: content.publishedAt,
                }}
                onPublish={(publishedAt) => handleSubmit('publish', publishedAt)}
                onRequestReview={() => handleSubmit('review')}
            />
            <ConfirmModal
                open={openDeleteModal}
                onConfirm={handleConfirmDelete}
                config={deleteConfig}
                name='content'
                closeModal={() => setOpenDeleteModal(false)}
            />
            <MediaGallery
                mediaType={
                    state.galleryMode === 'video-block' ? 'VIDEO'
                        : state.galleryMode === 'audio-block' ? 'AUDIO'
                            : state.galleryMode === 'gallery' || state.galleryMode === 'block' ? 'IMAGE'
                                : type === 'VIDEO' ? 'VIDEO'
                                    : type === 'EPISODE' ? 'AUDIO'
                                        : 'IMAGE'
                }
                isOpen={state.galleryMode !== null}
                multiple={state.galleryMode === 'gallery'}
                onClose={() => dispatch({ type: 'close-gallery' })}
                onSelect={(media) => dispatch({ type: 'select-media', payload: media })}
                onSelectMany={(media) => dispatch({ type: 'select-media-many', payload: media })}
            />
        </div>
    );
};
