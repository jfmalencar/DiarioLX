import { useEffect, useMemo, useState } from 'react';

import { useMedia, type Media } from '@/shared/hooks/useMedia';
import { useFilters } from '../hooks/useFilters';

type MediaGalleryProps = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (media: Media) => void;
};

export function MediaGallery({ isOpen, onClose, onSelect }: MediaGalleryProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [photographer, setPhotographer] = useState('');
    const [altText, setAltText] = useState('');

    const { buildQuery } = useFilters();
    const { fetchAll, getSignedUrl, completeUpload, medias, loading } = useMedia();

    useEffect(() => {
        if (!isOpen) return;
        const load = async () => {
            const params = buildQuery({ p: 'page', total: 'limit' });
            await fetchAll(params);
        };

        load();
    }, [isOpen, fetchAll, buildQuery]);

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
        setPhotographer('');
        setAltText('');
        setShowUploadForm(false);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true);
            const response = await getSignedUrl({
                file: selectedFile,
                photographer,
                alt: altText,
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

    console.log('medias', medias)

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
                        <h5 className='modal-title'>Media Gallery</h5>
                        <button
                            type='button'
                            className='btn-close'
                            aria-label='Close'
                            onClick={onClose}
                        />
                    </div>
                    <div className='modal-body'>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <div>
                                <strong>Images</strong>
                            </div>
                            <button
                                type='button'
                                className='btn btn-primary'
                                onClick={() => setShowUploadForm((prev) => !prev)}
                            >
                                {showUploadForm ? 'Cancel' : 'Add new image'}
                            </button>
                        </div>
                        {showUploadForm && (
                            <div className='card mb-4'>
                                <div className='card-body'>
                                    <div className='row g-3'>
                                        <div className='col-12'>
                                            <label className='form-label'>Choose image</label>
                                            <input
                                                type='file'
                                                accept='image/*'
                                                className='form-control'
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            <label className='form-label'>Photographer</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={photographer}
                                                onChange={(e) => setPhotographer(e.target.value)}
                                                placeholder='Photographer name'
                                            />
                                        </div>
                                        <div className='col-12 col-md-6'>
                                            <label className='form-label'>Alt text</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={altText}
                                                onChange={(e) => setAltText(e.target.value)}
                                                placeholder='Describe the image'
                                            />
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
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary'
                                                onClick={resetUploadForm}
                                                disabled={isUploading}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type='button'
                                                className='btn btn-primary'
                                                onClick={handleUpload}
                                                disabled={!selectedFile || isUploading}
                                            >
                                                {isUploading ? 'Uploading...' : 'Upload image'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {loading ? (
                            <div className='text-center py-4'>Loading images...</div>
                        ) : medias.length === 0 ? (
                            <div className='text-center py-4 text-muted'>
                                No images found.
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
                                                alt={item.alt || 'Media image'}
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
                                                    {item.alt || 'alt text'}
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
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}