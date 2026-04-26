import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMedia, type Media } from '@/shared/hooks/useMedia';
import { useFilters } from '../hooks/useFilters';
import { useUsers } from '../hooks/useUsers';

import { FieldSection } from './inputs/FieldSection';
import { UnderlineInput } from './inputs/UnderlineInput';
import { SearchField } from './inputs/SearchField';
import { Button } from './Button';
import { Pill } from './Pill';

type MediaGalleryProps = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: Media) => void;
};

export function MediaGallery({ isOpen, onClose, onSelect }: MediaGalleryProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [photographer, setPhotographer] = useState({ id: '', name: '' });
    const [altText, setAltText] = useState('');

    const { fetchAll: fetchUsers, users } = useUsers();
    const { buildQuery } = useFilters();
    const { fetchAll, getSignedUrl, completeUpload, medias, loading } = useMedia();

    const load = useCallback(async () => {
        const params = buildQuery({ p: 'page', total: 'limit' });
        await fetchAll(params);
    }, [fetchAll, buildQuery]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const query = photographer.name.trim().toLowerCase();
            fetchUsers({ query });
        }, 400);
        return () => clearTimeout(timeout);
    }, [photographer, fetchUsers]);

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
        setSelectedFile(file);
    };

    const resetUploadForm = () => {
        setSelectedFile(null);
        setPhotographer({ id: '', name: '' });
        setAltText('');
        setShowUploadForm(false);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true);
            const response = await getSignedUrl({
                file: selectedFile,
                photographerId: photographer.id,
                altText,
            });
            if (!response) {
                throw new Error('Failed to upload media');
            }

            const { signedUrl, id } = response;

            const uploadResult = await fetch(signedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': selectedFile.type,
                },
                body: selectedFile,
            });

            if (!uploadResult.ok) {
                throw new Error('Failed to upload media to storage');
            }

            await completeUpload(id);
            resetUploadForm();
            load();
        } finally {
            setIsUploading(false);
        }
    };

    const handleOverlayClick = () => {
        onClose();
    };

    const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
    };

    return (
        <div
            className='modal d-block'
            tabIndex={-1}
            role='dialog'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleOverlayClick}
        >
            <div
                className='modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable'
                onClick={handleModalClick}
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
                        {!showUploadForm &&
                            <div className='d-flex justify-content-end align-items-center mb-3'>
                                <Button
                                    className='btn btn-primary'
                                    onClick={() => setShowUploadForm((prev) => !prev)}
                                >
                                    Adicionar imagem
                                </Button>
                            </div>
                        }
                        {showUploadForm && (
                            <div className='card mb-4'>
                                <div className='card-body'>
                                    <div className='row g-3'>
                                        <div className='col-12'>
                                            <input
                                                type='file'
                                                accept='image/*'
                                                className='form-control'
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            <FieldSection title='Fotógrafo' className='mb-0'>
                                                {photographer.id ? (
                                                    <Pill
                                                        label={photographer.name}
                                                        onRemove={() => setPhotographer({ id: '', name: '' })}
                                                    />
                                                ) : (
                                                    <SearchField
                                                        disabled={loading}
                                                        value={photographer.name}
                                                        name='photographer'
                                                        options={users.map((user) => ({
                                                            id: user.userId,
                                                            name: user.fName + ' ' + user.lName,
                                                        }))}
                                                        placeholder='Pesquisar fotógrafo...'
                                                        onSearch={(e) =>
                                                            setPhotographer({ id: '', name: e.currentTarget.value })
                                                        }
                                                        onSelect={(option) =>
                                                            setPhotographer({ id: option.id, name: option.name })
                                                        }
                                                    />
                                                )}
                                            </FieldSection>
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            <FieldSection title='Texto alternativo'>
                                                <UnderlineInput
                                                    value={altText}
                                                    name='altText'
                                                    placeholder='Descreva a imagem para acessibilidade'
                                                    onChange={(e) => setAltText(e.currentTarget.value)}
                                                />
                                            </FieldSection>
                                        </div>
                                        {previewUrl && (
                                            <div className='col-12'>
                                                <label className='form-label'>Preview</label>
                                                <div className='border rounded p-2'>
                                                    <img
                                                        src={previewUrl}
                                                        alt='Preview'
                                                        className='img-fluid rounded'
                                                        style={{ maxHeight: 240 }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className='col-12 d-flex justify-content-end gap-2'>
                                            <Button
                                                color='secondary'
                                                onClick={resetUploadForm}
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
                            <div className='text-center py-4'>A carregar imagens...</div>
                        ) : medias.length === 0 ? (
                            <div className='text-center py-4 text-muted'>
                                Nenhuma imagem encontrada.
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
                                            <img
                                                src={item.thumbnailUrl || item.url}
                                                alt={item.altText || 'Media image'}
                                                className='w-100'
                                                style={{
                                                    height: 180,
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                }}
                                            />
                                            <div className='p-2'>
                                                <div className='small text-truncate'>
                                                    {item.photographer.name}
                                                </div>
                                                <div className='small text-muted text-truncate'>
                                                    {item.altText || 'Texto alternativo não fornecido'}
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