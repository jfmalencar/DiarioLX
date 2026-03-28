import { type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

type AlertVariant = 'warning' | 'danger' | 'info' | 'success';

type Props = {
    variant?: AlertVariant;
    title?: string;
    children: ReactNode;
};

export const Alert = ({
    variant = 'info',
    title,
    children,
}: Props) => {
    const config = {
        warning: {
            icon: <AlertTriangle size={20} />,
            containerClassName: 'alert alert-warning mb-0 d-flex gap-3 align-items-start',
        },
        danger: {
            icon: <XCircle size={20} />,
            containerClassName: 'alert alert-danger mb-0 d-flex gap-3 align-items-start',
        },
        info: {
            icon: <Info size={20} />,
            containerClassName: 'alert alert-info mb-0 d-flex gap-3 align-items-start',
        },
        success: {
            icon: <CheckCircle2 size={20} />,
            containerClassName: 'alert alert-success mb-0 d-flex gap-3 align-items-start',
        },
    }[variant];

    return (
        <div className={config.containerClassName} role='alert'>
            <div>
                <div className='d-flex align-items-center mt-1 mb-1'>
                    <div className='line-height-1 me-1'>
                        {config.icon}
                    </div>
                    {title && (
                        <div className='fw-semibold line-height-1'>
                            {title}
                        </div>
                    )}
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}
