import { useEffect, useMemo, useReducer, useState } from 'react';
import { Search } from 'lucide-react';

import { useMedia, type Media } from '@/shared/hooks/useMedia';
import { useLoadMore } from '@/shared/hooks/useLoadMore';
import { useMediaService } from '@/shared/services/media';
import type { MediasResponse } from '@/shared/services/media/media.types';
import { useFilters } from '@/shared/hooks/useFilters';
import { useUsers } from '@/shared/hooks/useUsers';
import { usePath } from '@/shared/hooks/usePath';
import { useBootstrap } from '@/shared/hooks/useBootstrap';
import { useSnackbar } from '@/shared/hooks/useSnackbar';

import { FieldSection } from '../inputs/FieldSection';
import { UnderlineInput } from '../inputs/UnderlineInput';
import { SearchField } from '../inputs/SearchField';
import { Button } from '../Button';
import { Pill } from '../Pill';

import type { MediaGalleryProps, MediaType } from './MediaGallery.types';
import { initialMediaGalleryState, mediaGalleryReducer } from './MediaGallery.reducer';

const MAX_UPLOAD_BYTES: Record<MediaType, number> = {
    IMAGE: 15 * 1024 * 1024, // 15 MB
    AUDIO: 200 * 1024 * 1024, // 200 MB
    VIDEO: 2 * 1024 * 1024 * 1024, // 2 GB
};

const formatSize = (bytes: number): string =>
    bytes >= 1024 * 1024 * 1024
        ? `${bytes / (1024 * 1024 * 1024)} GB`
        : `${Math.round(bytes / (1024 * 1024))} MB`;

export const MediaGallery = ({ mediaType, isOpen, onClose, onSelect, multiple = false, onSelectMany }: MediaGalleryProps) => {
    const [state, dispatch] = useReducer(
        mediaGalleryReducer,
        initialMediaGalleryState,
    );

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [prevOpen, setPrevOpen] = useState(isOpen);

    if (prevOpen !== isOpen) {
        setPrevOpen(isOpen);
        if (!isOpen) {
            setSelectedIds([]);
            setSearch('');
            setDebouncedSearch('');
        }
    }

    const toggleSelected = (id: number) =>
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((it) => it !== id) : [...prev, id]));

    const confirmMany = () => {
        const chosen = selectedIds
            .map((id) => medias.find((m) => m.id === id))
            .filter((m): m is Media => Boolean(m));
        onSelectMany?.(chosen);
        setSelectedIds([]);
    };

    const handleItemClick = (item: Media) => {
        if (multiple) {
            toggleSelected(item.id);
        } else {
            onSelect(item);
        }
    };

    const {
        isUploading,
        showUploadForm,
        selectedFile,
        credits,
        creditUser,
        creditRole,
        altText,
        uploadProgress,
    } = state;

    const { buildMediaUrl } = usePath()
    const { fetchAll: fetchUsers, users } = useUsers();
    const { buildQuery } = useFilters();
    const mediaService = useMediaService();
    const { getSignedUrl, completeUpload, loading: uploadLoading } = useMedia();
    const { creditRoles } = useBootstrap();
    const { showSnackbar } = useSnackbar();

    const fetchPage = useMemo(
        () =>
            isOpen
                ? (page: number) =>
                      mediaService.fetchAll(buildQuery({}, { type: mediaType, page, query: debouncedSearch }))
                : null,
        [isOpen, mediaService, buildQuery, mediaType, debouncedSearch],
    );

    const {
        items: medias,
        hasMore,
        loadMore,
        reload,
        loading,
        loadingMore,
    } = useLoadMore<Media, MediasResponse>(fetchPage);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const query = creditUser.name.trim().toLowerCase();
            fetchUsers({ query });
        }, 400);

        return () => clearTimeout(timeout);
    }, [creditUser.name, fetchUsers]);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 400);
        return () => clearTimeout(timeout);
    }, [search]);

    const previewUrl = useMemo(() => {
        if (!selectedFile) return null;
        return URL.createObjectURL(selectedFile);
    }, [selectedFile]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (!isOpen) return null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        if (file) {
            const expected = mediaType.toLowerCase();
            const label = mediaType === 'IMAGE' ? 'imagem' : mediaType === 'VIDEO' ? 'vídeo' : 'áudio';
            if (!file.type.startsWith(`${expected}/`)) {
                showSnackbar(`Ficheiro inválido. Selecione um ficheiro de ${label}.`, 'error');
                event.target.value = '';
                dispatch({ type: 'set-selected-file', file: null });
                return;
            }
            if (file.size > MAX_UPLOAD_BYTES[mediaType]) {
                showSnackbar(`Ficheiro demasiado grande. O tamanho máximo para ${label} é ${formatSize(MAX_UPLOAD_BYTES[mediaType])}.`, 'error');
                event.target.value = '';
                dispatch({ type: 'set-selected-file', file: null });
                return;
            }
        }
        dispatch({ type: 'set-selected-file', file });
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            dispatch({ type: 'set-uploading', value: true });
            dispatch({ type: 'set-upload-progress', value: 0 });

            const response = await getSignedUrl({
                uploadType: 'CONTENT_IMAGES',
                file: selectedFile,
                altText,
                credits: credits.map((credit) => ({
                    userId: credit.userId,
                    role: credit.role,
                })),
            });

            if (!response) throw new Error('Failed to upload media');

            const { signedUrl, id } = response;

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        dispatch({
                            type: 'set-upload-progress',
                            value: Math.round((event.loaded / event.total) * 100),
                        });
                    }
                };

                xhr.onload = () =>
                    xhr.status >= 200 && xhr.status < 300
                        ? resolve()
                        : reject(new Error('Failed to upload media to storage'));

                xhr.onerror = () => reject(new Error('Failed to upload media to storage'));

                xhr.open('PUT', signedUrl);
                xhr.setRequestHeader('Content-Type', selectedFile.type);
                xhr.send(selectedFile);
            });

            await completeUpload(id);
            dispatch({ type: 'reset-upload-form' });
            reload();
        } finally {
            dispatch({ type: 'set-uploading', value: false });
            dispatch({ type: 'set-upload-progress', value: 0 });
        }
    };

    const getMediaLabel = () => {
        if (mediaType === 'IMAGE') return 'Imagem';
        if (mediaType === 'VIDEO') return 'Vídeo';
        return 'Áudio';
    };

    const getAltTextPlaceholder = () => {
        if (mediaType === 'IMAGE') return 'Descreva a imagem para acessibilidade';
        if (mediaType === 'VIDEO') return 'Descreva o conteúdo do vídeo';
        return 'Descreva o conteúdo do áudio';
    };

    const getRoleLabel = (roleValue: string) => {
        return creditRoles.find((role) => role.value === roleValue)?.label ?? roleValue;
    };

    const renderUploadPreview = () => {
        if (!previewUrl) return null;
        if (mediaType === 'IMAGE') {
            return (
                <img
                    src={previewUrl}
                    alt='Preview'
                    className='img-fluid rounded'
                    style={{ maxHeight: 240 }}
                />
            );
        }
        if (mediaType === 'VIDEO') {
            return (
                <video
                    src={`${previewUrl}#t=1`}
                    controls
                    muted
                    preload='metadata'
                    className='w-100 rounded'
                    style={{ maxHeight: 240 }}
                />
            );
        }

        return <audio src={previewUrl} controls className='w-100' />;
    };

    const renderMediaPreview = (item: Media) => {
        if (mediaType === 'IMAGE') {
            return (
                <img
                    src={item.thumbnailPath ? buildMediaUrl(item.thumbnailPath) : buildMediaUrl(item.path)}
                    alt={item.altText || 'Media image'}
                    className='w-100'
                    style={{
                        height: 180,
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />
            );
        }
        if (mediaType === 'VIDEO') {
            return (
                <video
                    src={`${buildMediaUrl(item.path)}#t=1`}
                    poster={item.thumbnailPath ? buildMediaUrl(item.thumbnailPath) : buildMediaUrl(item.path)}
                    muted
                    preload='metadata'
                    className='w-100'
                    style={{
                        height: 180,
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />
            );
        }

        return (
            <div
                className='d-flex align-items-center justify-content-center bg-light'
                style={{ height: 180 }}
            >
                <span className='text-muted'>Áudio</span>
            </div>
        );
    };

    const getCreditsLabel = (item: Media) => {
        if (!item.credits?.length) return 'Sem créditos';

        return item.credits
            .map((credit) => {
                const name = credit.name;
                return `${name} · ${getRoleLabel(credit.role)}`;
            })
            .join(', ');
    };

    return (
        <div
            className='modal d-block'
            tabIndex={-1}
            role='dialog'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
        >
            <div
                className='modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable'
                onClick={(event) => event.stopPropagation()}
            >
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5 className='modal-title'>Galeria de Media</h5>
                        <button
                            type='button'
                            className='btn-close'
                            aria-label='Fechar'
                            onClick={onClose}
                        />
                    </div>

                    <div className='modal-body'>
                        {!showUploadForm && (
                            <div className='d-flex justify-content-between align-items-center gap-2 mb-3'>
                                <div className='position-relative' style={{ flex: 1, maxWidth: 280 }}>
                                    <Search
                                        size={16}
                                        className='position-absolute top-50 translate-middle-y text-muted'
                                        style={{ left: 10 }}
                                    />
                                    <input
                                        type='text'
                                        className='form-control ps-5'
                                        placeholder='Pesquisar por nome ou descrição...'
                                        value={search}
                                        onChange={(event) => setSearch(event.currentTarget.value)}
                                    />
                                </div>
                                <Button
                                    className='btn btn-primary'
                                    onClick={() =>
                                        dispatch({
                                            type: 'set-show-upload-form',
                                            value: true,
                                        })
                                    }
                                >
                                    Adicionar {getMediaLabel()}
                                </Button>
                            </div>
                        )}

                        {showUploadForm && (
                            <div className='card mb-4'>
                                <div className='card-body'>
                                    <div className='row g-3'>
                                        <div className='col-12'>
                                            <input
                                                type='file'
                                                accept={`${mediaType.toLowerCase()}/*`}
                                                className='form-control'
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        <div className='col-12'>
                                            <FieldSection title='Créditos' className='mb-0'>
                                                {credits.length > 0 && (
                                                    <div className='d-flex flex-wrap gap-2 mb-3'>
                                                        {credits.map((credit, index) => (
                                                            <Pill
                                                                key={`${credit.userId}-${credit.role}-${index}`}
                                                                label={`${credit.userName} · ${getRoleLabel(credit.role)}`}
                                                                onRemove={() =>
                                                                    dispatch({
                                                                        type: 'remove-credit',
                                                                        index,
                                                                    })
                                                                }
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                <div className='row g-2'>
                                                    <div className='col-12 col-md-6'>
                                                        {creditUser.id ? (
                                                            <Pill
                                                                label={creditUser.name}
                                                                onRemove={() =>
                                                                    dispatch({
                                                                        type: 'set-credit-user',
                                                                        user: { id: 0, name: '' },
                                                                    })
                                                                }
                                                            />
                                                        ) : (
                                                            <SearchField
                                                                disabled={uploadLoading}
                                                                value={creditUser.name}
                                                                name='creditUser'
                                                                options={users.map((user) => ({
                                                                    id: user.userId,
                                                                    name: `${user.firstName} ${user.lastName}`,
                                                                }))}
                                                                placeholder='Pesquisar usuário...'
                                                                onSearch={(event) =>
                                                                    dispatch({
                                                                        type: 'set-credit-user',
                                                                        user: {
                                                                            id: 0,
                                                                            name: event.currentTarget.value,
                                                                        },
                                                                    })
                                                                }
                                                                onSelect={(option) =>
                                                                    dispatch({
                                                                        type: 'set-credit-user',
                                                                        user: {
                                                                            id: option.id,
                                                                            name: option.name,
                                                                        },
                                                                    })
                                                                }
                                                            />
                                                        )}
                                                    </div>

                                                    <div className='col-12 col-md-4'>
                                                        <select
                                                            className='form-select'
                                                            value={creditRole}
                                                            onChange={(event) =>
                                                                dispatch({
                                                                    type: 'set-credit-role',
                                                                    role: event.currentTarget.value,
                                                                })
                                                            }
                                                        >
                                                            <option value=''>Selecionar função...</option>
                                                            {creditRoles.filter(role => role.mediaTypes.includes(mediaType.toUpperCase())).map((role) => (
                                                                <option key={role.value} value={role.value}>
                                                                    {role.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className='col-12 col-md-2'>
                                                        <Button
                                                            className='w-100'
                                                            onClick={() => dispatch({ type: 'add-credit' })}
                                                            disabled={!creditUser.id || !creditRole}
                                                        >
                                                            Adicionar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </FieldSection>
                                        </div>

                                        <div className='col-12'>
                                            <FieldSection title='Descrição acessível'>
                                                <UnderlineInput
                                                    value={altText}
                                                    name='altText'
                                                    placeholder={getAltTextPlaceholder()}
                                                    onChange={(event) =>
                                                        dispatch({
                                                            type: 'set-alt-text',
                                                            value: event.currentTarget.value,
                                                        })
                                                    }
                                                />
                                            </FieldSection>
                                        </div>

                                        {previewUrl && (
                                            <div className='col-12'>
                                                <label className='form-label'>Preview</label>
                                                <div className='border rounded p-2'>
                                                    {renderUploadPreview()}
                                                </div>
                                            </div>
                                        )}

                                        {isUploading && (
                                            <div className='progress'>
                                                <div
                                                    className='progress-bar bg-dark progress-bar-striped progress-bar-animated'
                                                    style={{ width: `${uploadProgress}%` }}
                                                >
                                                    {uploadProgress}%
                                                </div>
                                            </div>
                                        )}

                                        <div className='col-12 d-flex justify-content-end gap-2'>
                                            <Button
                                                color='secondary'
                                                onClick={() =>
                                                    dispatch({ type: 'reset-upload-form' })
                                                }
                                                disabled={isUploading}
                                            >
                                                Cancelar
                                            </Button>

                                            <Button
                                                onClick={handleUpload}
                                                disabled={!selectedFile || isUploading}
                                            >
                                                {isUploading ? 'A fazer upload...' : 'Fazer upload'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className='text-center py-4'>A carregar media...</div>
                        ) : medias.length === 0 ? (
                            <div className='text-center py-4 text-muted'>
                                Nenhum item encontrado.
                            </div>
                        ) : (
                            <div className='row g-3'>
                                {medias.map((item) => (
                                    <div key={item.id} className='col-6 col-md-4 col-lg-3'>
                                        <button
                                            type='button'
                                            className={`btn p-0 w-100 text-start overflow-hidden position-relative ${multiple && selectedIds.includes(item.id)
                                                ? 'border border-3 border-primary'
                                                : 'border'
                                                }`}
                                            onClick={() => handleItemClick(item)}
                                        >
                                            {multiple && selectedIds.includes(item.id) && (
                                                <span
                                                    className='position-absolute top-0 start-0 m-1 badge rounded-pill bg-primary'
                                                    style={{ zIndex: 1 }}
                                                >
                                                    {selectedIds.indexOf(item.id) + 1}
                                                </span>
                                            )}
                                            {renderMediaPreview(item)}

                                            <div className='p-2'>
                                                <div className='small text-truncate'>
                                                    {getCreditsLabel(item)}
                                                </div>

                                                <div className='small text-muted text-truncate'>
                                                    {item.altText || 'Descrição acessível não fornecida'}
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {hasMore && (
                            <div className='text-center mt-3'>
                                <Button
                                    color='secondary'
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? 'A carregar...' : 'Carregar mais'}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className='modal-footer'>
                        <button
                            type='button'
                            className='btn btn-secondary'
                            onClick={onClose}
                        >
                            Fechar
                        </button>
                        {multiple && (
                            <button
                                type='button'
                                className='btn btn-primary'
                                disabled={selectedIds.length === 0}
                                onClick={confirmMany}
                            >
                                Adicionar ({selectedIds.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}