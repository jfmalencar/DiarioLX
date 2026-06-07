import { useEffect } from 'react';

type Props = {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    delay: number;
    onClose: () => void;
};


export const Snackbar = ({ show, message, type, delay, onClose, }: Props) => {
    useEffect(() => {
        if (!show) return;
        const timer = setTimeout(onClose, delay);
        return () => clearTimeout(timer);
    }, [show, delay, onClose]);

    if (!show) return null;

    const bootstrapVariant = {
        success: "success",
        error: "danger",
        warning: "warning",
        info: "info",
    }[type];

    return (
        <div
            className='toast-container position-fixed bottom-0 end-0 p-3'
            style={{ zIndex: 1080 }}
        >
            <div
                className={`toast show text-bg-${bootstrapVariant} border-0`}
                role='alert'
            >
                <div className='d-flex'>
                    <div className='toast-body'>{message}</div>
                    <button
                        type='button'
                        className='btn-close btn-close-white me-2 m-auto'
                        onClick={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
