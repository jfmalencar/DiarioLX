import { useState, useEffect } from 'react';
import { Modal } from '@/shared/components/modals/Modal';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (comment: string) => void;
    actionType: 'approve' | 'reject';
};

export const ReviewModal = ({ isOpen, onClose, onConfirm, actionType }: Props) => {
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (!isOpen) setComment('');
    }, [isOpen]);

    const isApprove = actionType === 'approve';

    return (
        <Modal
            isOpen={isOpen}
            title={isApprove ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
            onClose={onClose}
            buttons={[
                {
                    key: 'confirm',
                    label: isApprove ? 'Aprovar e Publicar' : 'Rejeitar Conteúdo',
                    variant: isApprove ? 'primary' : 'danger',
                    onClick: () => onConfirm(comment),
                },
            ]}
        >
            <div className='mb-3'>
                <label 
                    htmlFor='review-comment' 
                    className='text-uppercase fw-semibold mb-2' 
                    style={{ fontSize: '0.75rem', color: '#666' }}
                >
                    {isApprove ? 'Nota de aprovação (Opcional)' : 'Motivo da rejeição (Recomendado)'}
                </label>
                <textarea
                    id='review-comment'
                    className='form-control'
                    rows={4}
                    placeholder={isApprove ? 'Escreva uma nota opcional...' : 'Explique o motivo da rejeição do artigo...'}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ fontSize: '0.9rem', resize: 'none' }}
                />
            </div>
        </Modal>
    );
};