import { useState } from 'react';
import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { Modal } from '@/shared/components/modals/Modal';
import { usePath } from '@/shared/hooks/usePath';
import type { Media } from '@/shared/hooks/useMedia';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onPublish: () => void;
    onRequestReview?: () => void;
    content: {
        title: string;
        category: string;
        featured: Media | null;
        authors: string[];
    };
};

export const PublishModal = ({ isOpen, onClose, onPublish, onRequestReview, content }: Props) => {
    const { buildMediaUrl } = usePath();
    const { user } = useAuthentication();

    const canPublish = user?.features?.includes('publish');
    const canRequestReview = user?.features?.includes('request-review');

    const [mode, setMode] = useState<'publish' | 'review'>(canPublish ? 'publish' : 'review');

    const handleConfirm = () => {
        if (mode === 'publish') onPublish();
        else if (onRequestReview) onRequestReview();
    };

    return (
        <Modal
            isOpen={isOpen}
            title='Confirma os detalhes da publicação'
            onClose={onClose}
            buttons={[
                {
                    key: 'confirm',
                    label: mode === 'publish' ? 'Publicar' : 'Pedir revisão',
                    variant: 'primary',
                    onClick: handleConfirm,
                },
            ]}
        >
            <div className='d-flex gap-3 mb-4'>
                {content.featured && content.featured.mimeType.startsWith('image') && (
                    <img
                        src={buildMediaUrl(content.featured.path)}
                        alt={content.title}
                        style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                    />
                )}
                {content.featured && content.featured.mimeType.startsWith('video') && (
                    <video
                        src={`${buildMediaUrl(content.featured.path)}#t=1`}
                        preload='metadata'
                        style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                    />
                )}
                <div>
                    <div className='fw-semibold mb-1' style={{ color: '#c00', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
                        {content.category.toUpperCase()}
                    </div>
                    <div className='fw-semibold' style={{ fontSize: '1rem', lineHeight: 1.3 }}>
                        {content.title}
                    </div>
                </div>
            </div>

            <div className='mb-3'>
                <div className='text-uppercase fw-semibold mb-1' style={{ fontSize: '0.75rem', color: '#666' }}>
                    Autores
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                    {content.authors.join(', ').toUpperCase()}
                </div>
            </div>

            <div>
                <div className='text-uppercase fw-semibold mb-2' style={{ fontSize: '0.75rem', color: '#666' }}>
                    Data de Publicação
                </div>
                <div className='border rounded p-3' style={{ backgroundColor: '#fff' }}>
                    {canPublish && (
                        <div className='form-check mb-2'>
                            <input
                                className='form-check-input'
                                type='radio'
                                id='mode-publish'
                                checked={mode === 'publish'}
                                onChange={() => setMode('publish')}
                            />
                            <label className='form-check-label' htmlFor='mode-publish'>
                                <div className='fw-medium'>Publicar agora</div>
                                <div className='text-muted' style={{ fontSize: '0.85rem' }}>
                                    O artigo ficará disponível publicamente de imediato
                                </div>
                            </label>
                        </div>
                    )}
                    {onRequestReview && canRequestReview && (
                        <div className='form-check'>
                            <input
                                className='form-check-input'
                                type='radio'
                                id='mode-review'
                                checked={mode === 'review'}
                                onChange={() => setMode('review')}
                            />
                            <label className='form-check-label' htmlFor='mode-review'>
                                <div className='fw-medium'>Aguarda aprovação</div>
                                <div className='text-muted' style={{ fontSize: '0.85rem' }}>
                                    O artigo será publicado após revisão editorial
                                </div>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};