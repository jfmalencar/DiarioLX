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
import { SearchField } from '@/shared/components/inputs/SearchField';
import { Pill } from '@/shared/components/Pill';

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

const ImageBlock = ({ url, alt = '', width = 400 }: ImageBlockProps) => (
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

const canPublish = (content: ContentEditingInput): boolean =>
    content.title.trim() !== '' &&
    content.slug.trim() !== '' &&
    content.category.id > 0 &&
    content.featuredMedia !== null &&
    content.mainAuthor !== null &&
    content.mainTag !== null;

export const EditContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const { buildMediaUrl } = usePath();
    const { t } = useI18n();
    const { user } = useAuthentication()

    const { fetchById, create, update, loading, publish, submit, delete: deleteContent } = useContents();
    const { fetchAll: fetchCategories, categories } = useCategories();
    const { fetchAll: fetchAuthors, users } = useUsers();
    const { fetchAll: fetchTags, tags } = useTags();
    const { showSnackbar } = useSnackbar();

    const [state, dispatch] = useReducer(editContentReducer, initialState);
    const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
    const [openConfirmaModal, setOpenConfirmModal] = useState<boolean>(false);

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
            if (user) {
                dispatch({ type: 'select-single', field: 'mainAuthor', searchField: 'mainAuthorSearch', option: { id: user.userId, name: user.firstName } })
            }
        }
        load();
    }, [location.state, fetchById, params.id, navigate, user]);

    const authors = useMemo(
        () => users.map((user) => ({ id: user.userId, name: `${user.firstName} ${user.lastName}` })),
        [users],
    );

    useDebouncedSearch(content.categorySearch, fetchCategories);
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
            try {
                id = await create({ type });
                dispatch({ type: 'set-content-id', payload: id });
            } catch (error) {
                showSnackbar('Erro ao criar conteúdo: ' + error, 'error');
                return null;
            }
        }

        const res = await update(id, {
            title: content.title,
            headline: content.headline,
            featuredMediaId: content.featuredMedia ? content.featuredMedia.id : null,
            slug: content.slug,
            categoryId: content.category.id ? content.category.id : null,
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

        if (!res) {
            showSnackbar('Erro ao guardar alterações', 'error');
            return null;
        }

        return id;
    }, [state, content, type, create, update, showSnackbar]);

    const handleUpdate = async () => {
        const id = await ensureSaved();
        if (id) {
            showSnackbar('Alterações salvas com sucesso!', 'success');
            dispatch({ type: 'set-dirty', payload: false });
        }
    };

    const handleSubmit = async (mode: 'publish' | 'review') => {
        if (!canPublish(content)) {
            setOpenConfirmModal(false)
            showSnackbar('Preencha os campos obrigatórios: Título, Slug e Categoria', 'error');
            return;
        }

        const id = await ensureSaved();
        if (!id) return;

        try {
            if (mode === 'publish') {
                const success = await publish(id);
                if (success) {
                    showSnackbar('Conteúdo publicado com sucesso!', 'success');
                    navigate(`/p/${content.slug}`);
                }
            } else {
                const success = await submit(id);
                if (success) {
                    showSnackbar('Revisão solicitada com sucesso!', 'success');
                    navigate('/backoffice/contents?tab=pending');
                }
            }
        } catch (error) {
            console.error(error)
            const msg = mode === 'publish' ? 'Erro ao publicar conteúdo' : 'Erro ao solicitar revisão';
            showSnackbar(msg, 'error');
        }
    };

    const handleDelete = async () => {
        if (!state.contentId) return;
        if (!window.confirm('Tem a certeza que deseja eliminar este conteúdo?')) return;

        try {
            await deleteContent(state.contentId);
            navigate('/backoffice/contents');
        } catch (error) {
            showSnackbar('Erro ao eliminar conteúdo: ' + error, 'error');
            navigate('/backoffice/contents');
        }
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
                            <div>Definições</div>
                        </div>
                    </div>
                </div>
            </header>
            <main className='d-flex flex-grow-1 overflow-hidden ps-5' style={{ minHeight: 0 }}>
                <div style={{ width: 320, flexShrink: 1, minWidth: 0 }} />
                <div className='flex-grow-1 overflow-y-auto py-4 pe-4 ps-5' style={{ minWidth: 0, maxWidth: 'calc(100vw - 610px)' }}>
                    <h1>
                        <textarea
                            className='font-noticia form-control border-0 bg-transparent shadow-none px-0 mb-3 resize-none overflow-hidden'
                            style={{ minHeight: 0, fontSize: '1.75rem', resize: 'none', fontWeight: 500 }}
                            disabled={loading}
                            value={content.title}
                            placeholder='Adiciona um título'
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
                            placeholder='Adiciona uma entrada'
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
                    ) : (
                        <button
                            type='button'
                            disabled={loading}
                            className='btn btn-outline-dark w-100 d-flex align-items-center justify-content-between rounded-0 px-2 mb-3'
                            style={{ height: 48 }}
                            onClick={() => dispatch({ type: 'open-gallery', payload: 'featured' })}
                        >
                            {type === 'ARTICLE' || type === 'PODCAST' ? (
                                <span className='fs-5'>Imagem em destaque</span>
                            ) : type === 'VIDEO' ? (
                                <span className='fs-5'>Vídeo</span>
                            ) : type === 'EPISODE' ? (
                                <span className='fs-5'>Áudio do Episódio</span>
                            ) : null}
                            <Upload size={28} />
                        </button>
                    )}
                    {state.blocks.map((block) => (
                        <div key={block.id} className='ej-block'>
                            <div className='ej-block__gutter'>
                                <AddMenu afterId={block.id} dispatch={dispatch} loading={loading} inline />
                                <button
                                    type='button'
                                    disabled={loading}
                                    className='ej-block__delete btn btn-sm p-0 d-flex align-items-center justify-content-center'
                                    aria-label='Remover bloco'
                                    onClick={() => dispatch({ type: 'remove-block', payload: { blockId: block.id } })}
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                            <div className='ej-block__content'>
                                {block.type === 'IMAGE' ? (
                                    <ImageBlock url={buildMediaUrl(block.media.path)} alt={block.media.altText} />
                                ) : (
                                    <RichTextBlock
                                        value={block.content}
                                        variant={getVariant(block)}
                                        disabled={loading}
                                        onChange={(html) => dispatch({ type: 'update-content-block', payload: { blockId: block.id, content: html } })}
                                        onFocusEditor={(editor) => setActiveEditor(editor)}
                                        onBlurEditor={(event) => handleBlurEditor(event)}
                                        placeholder='Começa a escrever'
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <AddMenu dispatch={dispatch} loading={loading} />
                </div>
                <div className='pt-4 border-start border-dark' style={{ width: 366, flexShrink: 0, overflowY: 'auto' }}>
                    <form onSubmit={handleUpdate} className='bg-transparent'>
                        <div className='px-4'>
                            <FieldSection title='Slug'>
                                <UnderlineInput
                                    value={content.slug}
                                    name='slug'
                                    disabled={loading}
                                    placeholder={`slug-do-${type?.toLocaleLowerCase()}`}
                                    onChange={(e) => dispatch({ type: 'edit', field: 'slug', value: slugify(e.currentTarget.value) })}
                                    dataTestId='content-slug-input'
                                />
                            </FieldSection>
                            <FieldSection title='Categoria'>
                                {content.category.id ? (
                                    <Pill label={content.category.name} onRemove={() => dispatch({ type: 'clear-single', field: 'category', searchField: 'categorySearch' })} />
                                ) : (
                                    <SearchField
                                        value={content.categorySearch}
                                        name='categorySearch'
                                        options={categories}
                                        placeholder='Pesquisar categoria'
                                        onSearch={(e) => dispatch({ type: 'edit', field: 'categorySearch', value: e.currentTarget.value })}
                                        onSelect={(option) => dispatch({ type: 'select-single', field: 'category', searchField: 'categorySearch', option })}
                                    />
                                )}
                            </FieldSection>
                            <FieldSection title='Tag principal'>
                                {content.mainTag.id ? (
                                    <Pill label={content.mainTag.name} onRemove={() => dispatch({ type: 'clear-single', field: 'mainTag', searchField: 'mainTagSearch' })} />
                                ) : (
                                    <SearchField
                                        disabled={loading}
                                        value={content.mainTagSearch}
                                        name='mainTagSearch'
                                        options={filteredTags}
                                        placeholder='Pesquisar tag principal'
                                        onSearch={(e) => dispatch({ type: 'edit', field: 'mainTagSearch', value: e.currentTarget.value })}
                                        onSelect={(option) => dispatch({ type: 'select-single', field: 'mainTag', searchField: 'mainTagSearch', option })}
                                    />
                                )}
                            </FieldSection>
                            <FieldSection title='Tags secundárias' optional={true}>
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
                                    placeholder='Pesquisar tag secundária'
                                    onSearch={(e) => dispatch({ type: 'edit', field: 'secondaryTagSearch', value: e.currentTarget.value })}
                                    onSelect={(option) => dispatch({ type: 'add-secondary', field: 'secondaryTags', searchField: 'secondaryTagSearch', option })}
                                />
                            </FieldSection>
                            <FieldSection title='Autor responsável'>
                                {content.mainAuthor.id ? (
                                    <Pill label={content.mainAuthor.name} onRemove={canSelectMainAuthor ? () => dispatch({ type: 'clear-single', field: 'mainAuthor', searchField: 'mainAuthorSearch' }) : undefined} />
                                ) : (
                                    <SearchField
                                        disabled={loading}
                                        value={content.mainAuthorSearch}
                                        name='mainAuthorSearch'
                                        options={filteredAuthors}
                                        placeholder='Pesquisar autor responsável'
                                        onSearch={(e) => dispatch({ type: 'edit', field: 'mainAuthorSearch', value: e.currentTarget.value })}
                                        onSelect={(option) => dispatch({ type: 'select-single', field: 'mainAuthor', searchField: 'mainAuthorSearch', option })}
                                    />
                                )}
                            </FieldSection>
                            <FieldSection title='Restantes autores' optional={true}>
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
                                    placeholder='Pesquisar autor secundário'
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
                                onClick={handleDelete}
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
                                Guardar
                            </button>
                            <button
                                type='button'
                                className='btn btn-dark w-40 flex-grow-1'
                                disabled={loading}
                                onClick={() => setOpenConfirmModal(true)}
                                style={{ height: 40 }}
                            >
                                Publicar
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
                }}
                onPublish={() => handleSubmit('publish')}
                onRequestReview={() => handleSubmit('review')}
            />
            <MediaGallery
                mediaType={type === 'VIDEO' ? 'VIDEO' : type === 'EPISODE' ? 'AUDIO' : 'IMAGE'}
                isOpen={state.galleryMode !== null}
                onClose={() => dispatch({ type: 'close-gallery' })}
                onSelect={(media) => dispatch({ type: 'select-media', payload: media })}
            />
        </div>
    );
};
