import { useReducer, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import type { Editor } from '@tiptap/react';
import { Upload } from 'lucide-react';

import { RichTextToolbar } from '@/shared/components/richtext/RichTextToolbar';
import { RichTextBlock } from '@/shared/components/richtext/RichTextBlock';
import { FieldSection } from '@/shared/components/inputs/FieldSection';
import { UnderlineInput } from '@/shared/components/inputs/UnderlineInput';
import { MediaGallery } from '@/shared/components/MediaGallery';

import type { Media } from '@/shared/services/media/media.types';
import type { ArticleBlock } from '@/shared/services/articles/articles.types';

import { useArticles } from '@/shared/hooks/useArticles';

import icon from '@/assets/icon.svg';

type Props = {
    url: string;
    alt: string;
    width?: number;
};

type ArticleEditingInput = {
    title: string;
    slug: string;
    headline: string;
    featuredMedia: Media | null;
};

type GalleryMode = 'featured' | 'block' | null;

type EditArticleState =
    {
        tag: 'loading' | 'editing';
        articleData: ArticleEditingInput;
        blocks: ArticleBlock[];
        galleryMode: GalleryMode;
    }

type EditArticleAction =
    | { type: 'change-tag', payload: EditArticleState['tag'] }
    | { type: 'edit'; inputName: string; inputValue: string }
    | { type: 'open-gallery'; payload: Exclude<GalleryMode, null> }
    | { type: 'close-gallery' }
    | { type: 'select-media'; payload: Media }
    | { type: 'add-text-block' }
    | { type: 'remove-block'; payload: { blockId: string } }
    | { type: 'update-text-block'; payload: { blockId: string; content: string } };

const generateId = () => crypto.randomUUID().toString();

const initialState: EditArticleState = {
    tag: 'editing',
    articleData: {
        title: '',
        slug: '',
        headline: '',
        featuredMedia: null,
    },
    blocks: [],
    galleryMode: null,
};

const editArticleReducer = (
    state: EditArticleState,
    action: EditArticleAction,
): EditArticleState => {
    switch (action.type) {
        case 'edit':
            return {
                ...state, articleData: {
                    ...state.articleData,
                    [action.inputName]: action.inputValue,
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
                        ...state.articleData,
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

        case 'add-text-block': {
            const newBlock: ArticleBlock = {
                id: generateId(),
                type: 'text',
                position: state.blocks.length,
                content: '<p></p>',
            };

            return {
                ...state,
                blocks: [...state.blocks, newBlock],
            };
        }

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
                (block) => block.id === action.payload.blockId,
            );
            if (!blockToRemove) return state;
            return {
                ...state,
                blocks: state.blocks
                    .filter((block) => block.id !== action.payload.blockId)
                    .map((block) =>
                        block.position > blockToRemove.position
                            ? { ...block, position: block.position - 1 }
                            : block,
                    ),
            };
        }

        case 'change-tag':
            return {
                ...state,
                tag: action.payload,
            };

        default:
            return state;
    }
}

const ImageBlock = ({ url, alt = '', width = 400 }: Props) => {
    return (
        <div className='mb-4'>
            <img
                src={url}
                alt={alt}
                className='img-fluid rounded'
                style={{ width }}
            />
        </div>
    );
};

export const EditArticle = () => {
    const navigate = useNavigate();
    const { create, loading } = useArticles();
    const [state, dispatch] = useReducer(editArticleReducer, initialState);
    const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
    const params = useParams();

    const handleChangeTextBlock = (blockId: string, html: string) => {
        dispatch({
            type: 'update-text-block',
            payload: { blockId, content: html },
        });
    };

    const handleFocusEditor = (editor: Editor) => {
        setActiveEditor(editor);
    };

    const handleBlurEditor = (event: FocusEvent) => {
        const toolbar = document.getElementById('richtext-toolbar');
        const isClickInsideToolbar = toolbar?.contains(event.relatedTarget as Node) ?? false;
        if (isClickInsideToolbar) {
            return;
        }
        setActiveEditor(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await create({
            id: generateId(),
            title: state.articleData.title,
            slug: state.articleData.slug,
            headline: state.articleData.headline,
            featuredMediaId: state.articleData.featuredMedia?.id || null,
            tags: [{
                tagId: '1',
            },
            {
                tagId: '2',
            }],
            category: {
                id: '1',
            },
            authors: [{
                authorId: '1',
            },
            {
                authorId: '2',
            }],
            blocks: state.blocks,
        })
        navigate('/p/' + state.articleData.slug);
    }

    return (
        <div className='d-flex flex-column vh-100 bg-light'>
            <header className='bg-black text-white border-bottom border-secondary position-sticky top-0'>
                <div className='container-fluid px-5'>
                    <div
                        className='d-flex align-items-center justify-content-between'
                        style={{ minHeight: 64 }}
                    >
                        <div className='d-flex align-items-center' style={{ width: 320 }}>
                            <Link
                                to='/admin/publicacoes'
                                className='d-flex align-items-center text-white text-decoration-none'
                            >
                                <img
                                    src={icon}
                                    alt='Ícone do DiárioLX'
                                    style={{ width: 28, height: 28 }}
                                    className='me-4'
                                />
                            </Link>
                            <RichTextToolbar
                                key={activeEditor?.instanceId}
                                editor={loading ? null : activeEditor}
                            />
                        </div>
                        <div className='fw-semibold' style={{ fontSize: '1.15rem' }}>
                            {params.id === 'nova' ? 'Criação' : 'Edição'} de artigo
                        </div>
                        <div
                            className='d-flex align-items-center gap-4'
                            style={{ width: 320 }}
                        >
                            <div
                                className='border-start border-white opacity-75'
                                style={{ height: 30 }}
                            />
                            <div>Definições</div>
                        </div>
                    </div>
                </div>
            </header>
            <main
                className='d-flex flex-grow-1 overflow-hidden ps-5'
                style={{ minHeight: 0 }}
            >
                <div style={{ width: 320, flexShrink: 1, minWidth: 0 }} />
                <div
                    className='flex-grow-1 overflow-auto py-4 pe-4'
                    style={{ minWidth: 0, maxWidth: 'calc(100vw - 610px)' }}
                >
                    <textarea
                        className='font-noticia form-control border-0 bg-transparent shadow-none px-0 mb-3 resize-none overflow-hidden'
                        style={{
                            minHeight: 0,
                            fontSize: '1.75rem',
                            resize: 'none',
                            fontWeight: 500,
                        }}
                        disabled={loading}
                        value={state.articleData.title}
                        placeholder='Adiciona um título'
                        onChange={(e) =>
                            dispatch({ type: 'edit', inputName: 'title', inputValue: e.target.value })
                        }
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = 'auto';
                            el.style.height = `${el.scrollHeight}px`;
                        }}
                        rows={1}
                    />
                    <textarea
                        className='font-noticia form-control border-0 bg-transparent shadow-none px-0 mb-3 resize-none overflow-hidden'
                        disabled={loading}
                        style={{ minHeight: 0, fontSize: '1.25rem', resize: 'none' }}
                        placeholder='Adiciona uma entrada'
                        value={state.articleData.headline}
                        onChange={(e) =>
                            dispatch({ type: 'edit', inputName: 'headline', inputValue: e.target.value })
                        }
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = 'auto';
                            el.style.height = `${el.scrollHeight}px`;
                        }}
                        rows={1}
                    />
                    {state.articleData.featuredMedia ? (
                        <div className='mb-4'>
                            <ImageBlock
                                width={600}
                                url={state.articleData.featuredMedia.url}
                                alt={state.articleData.featuredMedia.alt}
                            />
                        </div>
                    ) : (
                        <button
                            type='button'
                            disabled={loading}
                            className='btn btn-outline-dark w-100 d-flex align-items-center justify-content-between rounded-0 px-2 mb-3'
                            style={{ height: 48 }}
                            onClick={() =>
                                dispatch({
                                    type: 'open-gallery',
                                    payload: 'featured',
                                })
                            }
                        >
                            <span className='fs-5'>Imagem em destaque</span>
                            <Upload size={28} />
                        </button>
                    )}
                    {state.blocks.map((block) => (
                        <div key={block.id} className='position-relative'>
                            {block.type === 'image' ? (
                                <ImageBlock url={block.media.url} alt={block.media.alt} />
                            ) : (
                                <RichTextBlock
                                    value={block.content}
                                    disabled={loading}
                                    onChange={(html) => handleChangeTextBlock(block.id, html)}
                                    onFocusEditor={(editor) =>
                                        handleFocusEditor(editor)
                                    }
                                    onBlurEditor={(event) => handleBlurEditor(event)}
                                    placeholder='Começa a escrever'
                                />
                            )}
                            <button
                                type='button'
                                disabled={loading}
                                className='btn-close position-absolute top-0 end-0 m-2'
                                aria-label='Close'
                                onClick={() =>
                                    dispatch({
                                        type: 'remove-block',
                                        payload: { blockId: block.id },
                                    })
                                }
                            />
                        </div>
                    ))}
                    <div className='d-flex gap-3 mt-4'>
                        <button
                            type='button'
                            className='btn btn-dark'
                            disabled={loading}
                            onClick={() => dispatch({ type: 'add-text-block' })}
                        >
                            Adicionar texto
                        </button>
                        <button
                            type='button'
                            className='btn btn-outline-dark'
                            disabled={loading}
                            onClick={() =>
                                dispatch({
                                    type: 'open-gallery',
                                    payload: 'block',
                                })
                            }
                        >
                            Adicionar imagem
                        </button>
                    </div>
                </div>
                <div
                    className='px-4 pt-4 border-start border-dark'
                    style={{ width: 366, flexShrink: 0, overflowY: 'auto' }}
                >
                    <form onSubmit={handleSubmit} className='bg-transparent'>
                        <FieldSection title='Slug'>
                            <UnderlineInput
                                value={state.articleData.slug}
                                name='slug'
                                disabled={loading}
                                placeholder='slug-do-artigo'
                                onChange={(e) =>
                                    dispatch({
                                        type: 'edit',
                                        inputName: 'slug',
                                        inputValue: e.currentTarget.value,
                                    })
                                }
                                dataTestId='article-slug-input'
                            />
                        </FieldSection>
                        <FieldSection title='Nome'>
                            <UnderlineInput
                                value=''
                                name='name'
                                disabled={loading}
                                placeholder='Nome da categoria'
                                onChange={() => { }}
                                dataTestId='article-category-input'
                            />
                        </FieldSection>
                        <FieldSection title='Tag principal'>
                            <UnderlineInput
                                value=''
                                name='name'
                                disabled={loading}
                                placeholder='Uma tag principal'
                                onChange={() => { }}
                                dataTestId='article-tag-input'
                            />
                        </FieldSection>
                        <FieldSection title='Tags secundárias' optional={true}>
                            <UnderlineInput
                                value=''
                                name='name'
                                disabled={loading}
                                placeholder='Várias tags secundárias'
                                onChange={() => { }}
                                dataTestId='article-tag-input'
                            />
                        </FieldSection>
                        <FieldSection title='Autor responsável'>
                            <UnderlineInput
                                value=''
                                name='name'
                                disabled={loading}
                                placeholder='Pesquisar autor'
                                onChange={() => { }}
                                dataTestId='article-tag-input'
                            />
                        </FieldSection>
                        <FieldSection title='Restantes autores' optional={true}>
                            <UnderlineInput
                                value=''
                                name='name'
                                disabled={loading}
                                placeholder='Pesquisar autor'
                                onChange={() => { }}
                                dataTestId='article-tag-input'
                            />
                        </FieldSection>
                        <div className='position-sticky bottom-0 start-0 end-0 bg-light py-3 d-flex justify-content-end gap-3 border-top'>
                            <button type='submit' className='btn btn-dark mt-4 w-100' disabled={loading}>
                                Guardar alterações
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <MediaGallery
                isOpen={state.galleryMode !== null}
                onClose={() => dispatch({ type: 'close-gallery' })}
                onSelect={(media) =>
                    dispatch({
                        type: 'select-media',
                        payload: media,
                    })
                }
            />
        </div>
    );
}
