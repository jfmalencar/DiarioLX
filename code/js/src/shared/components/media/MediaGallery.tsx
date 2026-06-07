import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { useMedia, type Media } from '@/shared/hooks/useMedia';
import { useFilters } from '@/shared/hooks/useFilters';
import { useUsers } from '@/shared/hooks/useUsers';
import { usePath } from '@/shared/hooks/usePath';
import { useBootstrap } from '@/shared/hooks/useBootstrap';

import { FieldSection } from '../inputs/FieldSection';
import { UnderlineInput } from '../inputs/UnderlineInput';
import { SearchField } from '../inputs/SearchField';
import { Button } from '../Button';
import { Pill } from '../Pill';

import type { MediaGalleryProps } from './MediaGallery.types';
import { initialMediaGalleryState, mediaGalleryReducer } from './MediaGallery.reducer';

export function MediaGallery({ mediaType, isOpen, onClose, onSelect }: MediaGalleryProps) {
    const [state, dispatch] = useReducer(
        mediaGalleryReducer,
        initialMediaGalleryState,
    );

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
    const { fetchAll, getSignedUrl, completeUpload, medias, loading } = useMedia();
    const { creditRoles } = useBootstrap();

    console.log(creditRoles)

    const load = useCallback(async () => {
        const params = buildQuery({ p: 'page', total: 'size' }, { type: mediaType });
        await fetchAll(params);
    }, [fetchAll, buildQuery, mediaType]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const query = creditUser.name.trim().toLowerCase();
            fetchUsers({ query });
        }, 400);

        return () => clearTimeout(timeout);
    }, [creditUser.name, fetchUsers]);

    useEffect(() => {
        if (!isOpen) return;
        load();
    }, [isOpen, load]);

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
            load();
        } finally {
            dispatch({ type: 'set-uploading', value: false });
            dispatch({ type: 'set-upload-progress', value: 0 });
        }
    };

    const getMediaLabel = () => {
        if (mediaType === 'image') return 'Imagem';
        if (mediaType === 'video') return 'Vídeo';
        return 'Áudio';
    };

    const getAltTextPlaceholder = () => {
        if (mediaType === 'image') return 'Descreva a imagem para acessibilidade';
        if (mediaType === 'video') return 'Descreva o conteúdo do vídeo';
        return 'Descreva o conteúdo do áudio';
    };

    const getRoleLabel = (roleValue: string) => {
        return creditRoles.find((role) => role.value === roleValue)?.label ?? roleValue;
    };

    const renderUploadPreview = () => {
        if (!previewUrl) return null;

        if (mediaType === 'image') {
            return (
                <img
                    src={previewUrl}
                    alt='Preview'
                    className='img-fluid rounded'
                    style={{ maxHeight: 240 }}
                />
            );
        }

        if (mediaType === 'video') {
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
        if (mediaType === 'image') {
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

        if (mediaType === 'video') {
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
                            <div className='d-flex justify-content-end align-items-center mb-3'>
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
                                                accept={`${mediaType}/*`}
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
                                                                        user: { id: '', name: '' },
                                                                    })
                                                                }
                                                            />
                                                        ) : (
                                                            <SearchField
                                                                disabled={loading}
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
                                                                            id: '',
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
                                            className='btn p-0 border w-100 text-start overflow-hidden'
                                            onClick={() => onSelect(item)}
                                        >
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
                    </div>

                    <div className='modal-footer'>
                        <button
                            type='button'
                            className='btn btn-secondary'
                            onClick={onClose}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}