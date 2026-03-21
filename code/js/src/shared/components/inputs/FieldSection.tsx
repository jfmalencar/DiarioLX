export const FieldSection = ({ title, optional, description, children }: { title: string; optional?: boolean; description?: string; children: React.ReactNode }) => {
    return (
        <div className='mb-5'>
            <div className='d-flex align-items-center gap-2 mb-2'>
                <label className='fw-bold' style={{ fontSize: '1rem' }}>
                    {title}
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
