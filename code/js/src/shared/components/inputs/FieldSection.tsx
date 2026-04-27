type Props = {
    title: string
    optional?: boolean
    description?: string
    children: React.ReactNode
    className?: string
}

export const FieldSection = ({ title, optional, description, children, className = 'mb-5' }: Props) => {
    return (
        <div className={className}>
            <div className='d-flex align-items-center gap-2 mb-2'>
                <label className='fw-bold' style={{ fontSize: '1rem' }}>
                    {title.toUpperCase()}
                </label>
                {optional && <span className='text-uppercase text-muted small'>Opcional</span>}
            </div>
            {children}
            {description && (
                <p className='text-muted mt-3 mb-0' style={{ fontSize: '0.98rem' }}>
                    {description}
                </p>
            )}
        </div>
    );
}
