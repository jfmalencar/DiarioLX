import { useEffect, useRef, useState } from 'react';
import { useAuthentication } from '@/shared/hooks/useAuthentication';
import { Modal } from '@/shared/components/modals/Modal';
import { usePath } from '@/shared/hooks/usePath';
import { useI18n } from '@/shared/hooks/useI18n';
import type { Media } from '@/shared/hooks/useMedia';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onPublish: (publishedAt?: number) => void;
    onRequestReview?: () => void;
    content: {
        title: string;
        category: string;
        featured: Media | null;
        authors: string[];
        publishedAt?: number;
    };
};

export const PublishModal = ({ isOpen, onClose, onPublish, onRequestReview, content }: Props) => {
    const { buildMediaUrl } = usePath();
    const { user } = useAuthentication();
    const { t } = useI18n();

    const canPublish = user?.features?.includes('publish');
    const canRequestReview = user?.features?.includes('request-review');

    const [mode, setMode] = useState<'publish' | 'review'>(canPublish ? 'publish' : 'review');
    const [publishAt, setPublishAt] = useState('');
    const userEdited = useRef(false);

    useEffect(() => {
        if (!isOpen) {
            userEdited.current = false;
            return;
        }
        if (userEdited.current) return;
        setPublishAt(content.publishedAt ? new Date(content.publishedAt).toISOString().slice(0, 16) : '');
    }, [isOpen, content.publishedAt]);

    const handleConfirm = () => {
        if (mode === 'publish') {
            onPublish(publishAt ? Math.floor(new Date(publishAt).getTime() / 1000) : undefined);
        } else if (onRequestReview) {
            onRequestReview();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            title={t('posts.publish_modal_title')}
            onClose={onClose}
            buttons={[
                {
                    key: 'confirm',
                    label: mode === 'publish' ? t('common.publish') : t('posts.request_review'),
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
                    {t('posts.authors')}
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                    {content.authors.join(', ').toUpperCase()}
                </div>
            </div>
            <div>
                <div className='text-uppercase fw-semibold mb-2' style={{ fontSize: '0.75rem', color: '#666' }}>
                    {t('posts.publish_date')}
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
                                <div className='fw-medium'>{t('posts.approve_now')}</div>
                                <div className='text-muted' style={{ fontSize: '0.85rem' }}>
                                    {t('posts.approve_now_desc')}
                                </div>
                            </label>
                        </div>
                    )}
                    {canPublish && mode === 'publish' && (
                        <div className='ms-4 mb-2'>
                            <label className='form-label small text-muted mb-1' htmlFor='publish-at'>
                                {t('posts.publish_at_label')}
                            </label>
                            <input
                                id='publish-at'
                                type='datetime-local'
                                className='form-control form-control-sm'
                                value={publishAt}
                                onChange={(e) => {
                                    userEdited.current = true;
                                    setPublishAt(e.currentTarget.value);
                                }}
                            />
                            <div className='text-muted mt-1' style={{ fontSize: '0.8rem' }}>
                                {t('posts.publish_at_hint')}
                            </div>
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
                                <div className='fw-medium'>{t('posts.await_approval')}</div>
                                <div className='text-muted' style={{ fontSize: '0.85rem' }}>
                                    {t('posts.await_approval_desc')}
                                </div>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};