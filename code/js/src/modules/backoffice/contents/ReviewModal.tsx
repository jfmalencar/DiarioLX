import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/shared/components/modals/Modal';
import { useI18n } from '@/shared/hooks/useI18n';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (comment: string, publishedAt?: number) => void;
    actionType: 'approve' | 'reject';
    publishedAt?: number;
};

export const ReviewModal = ({ isOpen, onClose, onConfirm, actionType, publishedAt }: Props) => {
    const [comment, setComment] = useState('');
    const [publishAt, setPublishAt] = useState('');
    const userEdited = useRef(false);
    const { t } = useI18n();

    const isApprove = actionType === 'approve';

    useEffect(() => {
        if (!isOpen) {
            userEdited.current = false;
            return;
        }
        if (userEdited.current) return;
        setPublishAt(publishedAt ? new Date(publishedAt).toISOString().slice(0, 16) : '');
    }, [isOpen, publishedAt]);

    const handleClose = () => {
        setComment('');
        setPublishAt('');
        onClose();
    };

    const handleConfirm = () => {
        onConfirm(comment, publishAt ? Math.floor(new Date(publishAt).getTime() / 1000) : undefined);
        setComment('');
        setPublishAt('');
    };

    return (
        <Modal
            isOpen={isOpen}
            title={isApprove ? t('posts.confirm_approval') : t('posts.confirm_rejection')}
            onClose={handleClose}
            buttons={[
                {
                    key: 'confirm',
                    label: isApprove ? t('posts.approve_publish') : t('posts.reject_content'),
                    variant: isApprove ? 'primary' : 'danger',
                    onClick: handleConfirm,
                },
            ]}
        >
            <div className='mb-3'>
                <label
                    htmlFor='review-comment'
                    className='text-uppercase fw-semibold mb-2'
                    style={{ fontSize: '0.75rem', color: '#666' }}
                >
                    {isApprove ? t('posts.approval_note_label') : t('posts.rejection_reason_label')}
                </label>
                <textarea
                    id='review-comment'
                    className='form-control'
                    rows={4}
                    placeholder={isApprove ? t('posts.approval_note_placeholder') : t('posts.rejection_reason_placeholder')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ fontSize: '0.9rem', resize: 'none' }}
                />
            </div>
            {isApprove && (
                <div className='mb-3'>
                    <label
                        htmlFor='review-publish-at'
                        className='text-uppercase fw-semibold mb-2'
                        style={{ fontSize: '0.75rem', color: '#666' }}
                    >
                        {t('posts.publish_at_label')}
                    </label>
                    <input
                        id='review-publish-at'
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
        </Modal>
    );
};