import { useState } from 'react';
import { Modal } from '@/shared/components/modals/Modal';
import { useI18n } from '@/shared/hooks/useI18n';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (comment: string) => void;
    actionType: 'approve' | 'reject';
};

export const ReviewModal = ({ isOpen, onClose, onConfirm, actionType }: Props) => {
    const [comment, setComment] = useState('');
    const { t } = useI18n();

    const isApprove = actionType === 'approve';

    // Clear the comment as the modal closes, so the next open starts fresh.
    const handleClose = () => {
        setComment('');
        onClose();
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
                    onClick: () => {
                        onConfirm(comment);
                        setComment('');
                    },
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
        </Modal>
    );
};