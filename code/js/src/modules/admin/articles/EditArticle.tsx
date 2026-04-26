import { useReducer, useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import type { Editor } from '@tiptap/react';
import { Upload, EditIcon } from 'lucide-react';

import { RichTextToolbar } from '@/shared/components/richtext/RichTextToolbar';
import { RichTextBlock } from '@/shared/components/richtext/RichTextBlock';
import { FieldSection } from '@/shared/components/inputs/FieldSection';
import { UnderlineInput } from '@/shared/components/inputs/UnderlineInput';
import { MediaGallery } from '@/shared/components/MediaGallery';
import { SearchField } from '@/shared/components/inputs/SearchField';
import { Pill } from '@/shared/components/Pill';

import { useCategories } from '@/shared/hooks/useCategories';
import { useArticles } from '@/shared/hooks/useArticles';
import { useTags } from '@/shared/hooks/useTags';
import { useUsers } from '@/shared/hooks/useUsers';

import type { ImageBlockProps } from './EditArticle.types';
import { editArticleReducer, initialState } from './EditArticle.reducer';

import icon from '@/assets/icon.svg';

const useDebouncedSearch = (
    value: string,
    fetchFn: (args: { query: string }) => Promise<unknown>,
) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            const query = value.trim().toLowerCase();
            fetchFn({ query });
        }, 400);
        return () => clearTimeout(timeout);
    }, [value, fetchFn]);
};

const ImageBlock = ({ url, alt = '', width = 400 }: ImageBlockProps) => {
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
    const params = useParams();

    const { create, loading } = useArticles();
    const { fetchAll: fetchCategories, categories } = useCategories();
    const { fetchAll: fetchAuthors, users } = useUsers();
    const { fetchAll: fetchTags, tags } = useTags();

    const [state, dispatch] = useReducer(editArticleReducer, initialState);
    const [activeEditor, setActiveEditor] = useState<Editor | null>(null);

    const article = state.articleData;
    const authors = useMemo(() => users.map((user) => ({ id: user.userId, name: `${user.fName} ${user.lName}` })), [users]);

    useDebouncedSearch(article.categorySearch, fetchCategories);
    useDebouncedSearch(article.mainTagSearch, fetchTags);
    useDebouncedSearch(article.secondaryTagSearch, fetchTags);
    useDebouncedSearch(article.mainAuthorSearch, fetchAuthors);
    useDebouncedSearch(article.secondaryAuthorSearch, fetchAuthors);

    const filteredTags = tags.filter((tag) =>
        tag.id !== article.mainTag.id &&
        !article.secondaryTags.some((selectedTag) => selectedTag.id === tag.id),
    );

    const filteredAuthors = authors.filter((author) =>
        author.id !== article.mainAuthor.id &&
        !article.secondaryAuthors.some((selectedAuthor) => selectedAuthor.id === author.id),
    );

    const handleBlurEditor = (event: FocusEvent) => {
        const toolbar = document.getElementById('richtext-toolbar');
        const isClickInsideToolbar =
            toolbar?.contains(event.relatedTarget as Node) ?? false;

        if (isClickInsideToolbar) return;

        setActiveEditor(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await create({
            id: 'nova',
            title: article.title,
            slug: article.slug,
            headline: article.headline,
            featuredMediaId: article.featuredMedia?.id || null,
            tags: [
                { tagId: article.mainTag.id },
                ...article.secondaryTags.map((tag) => ({ tagId: tag.id })),
            ],
            category: { id: article.category.id },
            authors: [
                { authorId: article.mainAuthor.id },
                ...article.secondaryAuthors.map((author) => ({
                    authorId: author.id,
                })),
            ],
            blocks: state.blocks,
        });

        navigate('/p/' + article.slug);
    };

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
                        value={article.title}
                        placeholder='Adiciona um título'
                        onChange={(e) => dispatch({
                            type: 'edit',
                            field: 'title',
                            value: e.target.value
                        })}
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
                        value={article.headline}
                        onChange={(e) => dispatch({
                            type: 'edit',
                            field: 'headline',
                            value: e.target.value
                        })}
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = 'auto';
                            el.style.height = `${el.scrollHeight}px`;
                        }}
                        rows={1}
                    />
                    {article.featuredMedia ? (
                        <div className='mb-4 position-relative' style={{ width: 600 }}>
                            <ImageBlock
                                width={600}
                                url={article.featuredMedia.url}
                                alt={article.featuredMedia.altText}
                            />
                            <button
                                type='button'
                                className='btn btn-dark position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center'
                                style={{
                                    width: 36,
                                    height: 36,
                                }}
                                onClick={() => dispatch({
                                    type: 'open-gallery',
                                    payload: 'featured',
                                })}
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
                                <ImageBlock url={block.media.url} alt={block.media.altText} />
                            ) : (
                                <RichTextBlock
                                    value={block.content}
                                    disabled={loading}
                                    onChange={(html) => dispatch({
                                        type: 'update-text-block',
                                        payload: { blockId: block.id, content: html },
                                    })}
                                    onFocusEditor={(editor) => setActiveEditor(editor)}
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
                    className='pt-4 border-start border-dark'
                    style={{ width: 366, flexShrink: 0, overflowY: 'auto' }}
                >
                    <form onSubmit={handleSubmit} className='bg-transparent'>
                        <div className='px-4'>
                            <FieldSection title='Slug'>
                                <UnderlineInput
                                    value={article.slug}
                                    name='slug'
                                    disabled={loading}
                                    placeholder='slug-do-artigo'
                                    onChange={(e) => dispatch({
                                        type: 'edit',
                                        field: 'slug',
                                        value: e.currentTarget.value
                                    })}
                                    dataTestId='article-slug-input'
                                />
                            </FieldSection>
                            <FieldSection title='Categoria'>
                                {article.category.id ? (
                                    <Pill
                                        label={article.category.name}
                                        onRemove={() =>
                                            dispatch({
                                                type: 'clear-single',
                                                field: 'category',
                                                searchField: 'categorySearch',
                                            })
                                        }
                                    />
                                ) : (
                                    <SearchField
                                        value={article.categorySearch}
                                        name='categorySearch'
                                        options={categories}
                                        placeholder='Pesquisar categoria'
                                        onSearch={(e) =>
                                            dispatch({
                                                type: 'edit',
                                                field: 'categorySearch',
                                                value: e.currentTarget.value,
                                            })
                                        }
                                        onSelect={(option) =>
                                            dispatch({
                                                type: 'select-single',
                                                field: 'category',
                                                searchField: 'categorySearch',
                                                option,
                                            })
                                        }
                                    />
                                )}
                            </FieldSection>
                            <FieldSection title='Tag principal'>
                                {article.mainTag.id ? (
                                    <Pill
                                        label={article.mainTag.name}
                                        onRemove={() =>
                                            dispatch({
                                                type: 'clear-single',
                                                field: 'mainTag',
                                                searchField: 'mainTagSearch',
                                            })
                                        }
                                    />
                                ) : (
                                    <SearchField
                                        disabled={loading}
                                        value={article.mainTagSearch}
                                        name='mainTagSearch'
                                        options={filteredTags}
                                        placeholder='Pesquisar tag principal'
                                        onSearch={(e) =>
                                            dispatch({
                                                type: 'edit',
                                                field: 'mainTagSearch',
                                                value: e.currentTarget.value
                                            })
                                        }
                                        onSelect={(option) =>
                                            dispatch({
                                                type: 'select-single',
                                                field: 'mainTag',
                                                searchField: 'mainTagSearch',
                                                option
                                            })
                                        }
                                    />
                                )}
                            </FieldSection>
                            <FieldSection title='Tags secundárias' optional={true}>
                                <div className='d-flex flex-wrap gap-2 mb-2'>
                                    {article.secondaryTags.map((tag) => (
                                        <Pill
                                            key={tag.id}
                                            label={tag.name}
                                            onRemove={() =>
                                                dispatch({
                                                    type: 'remove-secondary',
                                                    field: 'secondaryTags',
                                                    id: tag.id
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                                <SearchField
                                    disabled={loading}
                                    value={article.secondaryTagSearch}
                                    name='secondaryTagSearch'
                                    options={filteredTags}
                                    placeholder='Pesquisar tag secundária'
                                    onSearch={(e) =>
                                        dispatch({
                                            type: 'edit',
                                            field: 'secondaryTagSearch',
                                            value: e.currentTarget.value
                                        })
                                    }
                                    onSelect={(option) =>
                                        dispatch({
                                            type: 'add-secondary',
                                            field: 'secondaryTags',
                                            searchField: 'secondaryTagSearch',
                                            option
                                        })
                                    }
                                />
                            </FieldSection>
                            <FieldSection title='Autor responsável'>
                                {article.mainAuthor.id ? (
                                    <Pill
                                        label={article.mainAuthor.name}
                                        onRemove={() =>
                                            dispatch({
                                                type: 'clear-single',
                                                field: 'mainAuthor',
                                                searchField: 'mainAuthorSearch',
                                            })
                                        }
                                    />
                                ) : (
                                    <SearchField
                                        disabled={loading}
                                        value={article.mainAuthorSearch}
                                        name='mainAuthorSearch'
                                        options={filteredAuthors}
                                        placeholder='Pesquisar autor responsável'
                                        onSearch={(e) =>
                                            dispatch({
                                                type: 'edit',
                                                field: 'mainAuthorSearch',
                                                value: e.currentTarget.value
                                            })
                                        }
                                        onSelect={(option) =>
                                            dispatch({
                                                type: 'select-single',
                                                field: 'mainAuthor',
                                                searchField: 'mainAuthorSearch',
                                                option
                                            })
                                        }
                                    />
                                )}
                            </FieldSection>
                            <FieldSection title='Restantes autores' optional={true}>
                                <div className='d-flex flex-wrap gap-2 mb-2'>
                                    {article.secondaryAuthors.map((author) => (
                                        <Pill
                                            key={author.id}
                                            label={author.name}
                                            onRemove={() =>
                                                dispatch({
                                                    type: 'remove-secondary',
                                                    field: 'secondaryAuthors',
                                                    id: author.id
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                                <SearchField
                                    disabled={loading}
                                    value={article.secondaryAuthorSearch}
                                    name='secondaryAuthorSearch'
                                    options={filteredAuthors}
                                    placeholder='Pesquisar autor secundário'
                                    onSearch={(e) =>
                                        dispatch({
                                            type: 'edit',
                                            field: 'secondaryAuthorSearch',
                                            value: e.currentTarget.value
                                        })
                                    }
                                    onSelect={(option) =>
                                        dispatch({
                                            type: 'add-secondary',
                                            field: 'secondaryAuthors',
                                            searchField: 'secondaryAuthorSearch',
                                            option
                                        })
                                    }
                                />
                            </FieldSection>
                        </div>

                        <div
                            className='bg-light p-3 position-sticky bottom-0 start-0 end-0'
                            style={{
                                boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.08)',
                            }}
                        >
                            <button
                                type='submit'
                                className='btn btn-dark w-100'
                                disabled={loading}
                            >
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
};
