import { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type Props = {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    delay: number;
    onClose: () => void;
};

const config = {
    success: {
        icon: CheckCircle,
        color: '#2d6a4f',
        bg: '#f0faf4',
        border: '#b7dfca',
    },
    error: {
        icon: XCircle,
        color: '#9b2335',
        bg: '#fdf4f5',
        border: '#f0b8be',
    },
    warning: {
        icon: AlertTriangle,
        color: '#92600a',
        bg: '#fffbf0',
        border: '#f5dfa0',
    },
    info: {
        icon: Info,
        color: '#1d4e89',
        bg: '#f0f6ff',
        border: '#b8d0f0',
    },
};

export const Snackbar = ({ show, message, type, delay, onClose }: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (show && !el.matches(':popover-open')) el.showPopover();
        if (!show && el.matches(':popover-open')) el.hidePopover();
        if (!show) return;
        const timer = setTimeout(onClose, delay);
        return () => clearTimeout(timer);
    }, [show, delay, onClose]);

    const { icon: Icon, color, bg, border } = config[type];

    return (
        <div
            ref={ref}
            popover='manual'
            className='p-3'
            style={{
                position: 'fixed',
                inset: 'auto',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                margin: 0,
                padding: '1rem',
                border: 'none',
                background: 'transparent',
                overflow: 'visible',
            }}
        >
            <div
                className='d-flex align-items-center gap-3 px-4 py-3 rounded-3'
                style={{
                    backgroundColor: bg,
                    border: `1px solid ${border}`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    minWidth: 280,
                    maxWidth: 420,
                }}
            >
                <Icon size={18} color={color} strokeWidth={2} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: '#1a1a1a', flex: 1 }}>
                    {message}
                </span>
                <button
                    type='button'
                    className='btn p-0 border-0 d-flex align-items-center'
                    style={{ background: 'transparent', color: '#999' }}
                    onClick={onClose}
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
