import { type ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export type ModalAction = {
    key: string;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
};

type Props = {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
    buttons?: ModalAction[];
};

export const Modal = ({
    isOpen,
    title,
    children,
    onClose,
    buttons = [],
}: Props) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) {
            dialog.showModal();
        }
        if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleCancel = (event: Event) => {
            event.preventDefault();
            onClose();
        };

        dialog.addEventListener('cancel', handleCancel);

        return () => {
            dialog.removeEventListener('cancel', handleCancel);
        };
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    const getButtonClassName = (variant: ModalAction['variant'] = 'secondary') => {
        switch (variant) {
            case 'primary':
                return 'btn btn-dark';
            case 'danger':
                return 'btn btn-danger';
            default:
                return 'btn btn-outline-dark';
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className='border-0 rounded-4 p-0 shadow-lg w-100'
            style={{ maxWidth: '560px' }}
        >
            <div className='bg-black text-white d-flex align-items-center justify-content-between px-4 py-3'>
                <div className='m-0'>{title}</div>
                <button
                    type='button'
                    className='btn btn-link text-white p-0 border-0 d-flex align-items-center justify-content-center text-decoration-none'
                    onClick={onClose}
                    aria-label='Fechar'
                >
                    <X size={32} />
                </button>
            </div>
            <div className='bg-light p-4'>
                <div>{children}</div>
                {buttons.length > 0 && (
                    <div className='d-flex justify-content-end gap-2 mt-4'>
                        {buttons.map((button) => (
                            <button
                                key={button.key}
                                type='button'
                                className={getButtonClassName(button.variant)}
                                onClick={button.onClick}
                                disabled={button.disabled}
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </dialog>
    );
}