import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    dataTestId?: string;
    color?: 'primary' | 'secondary';
};

export const Button = ({ children, dataTestId, disabled, type, onClick, className = '', color = 'primary' }: ButtonProps) => {
    const colorClass = color === 'primary' ? 'btn-dark' : 'btn-outline-dark'
    return (
        <button data-testid={dataTestId} type={type} className={`btn ${colorClass} px-4 rounded-3 ${className}`} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    )
}
