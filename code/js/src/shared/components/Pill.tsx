type PillProps = {
    label: string;
    onRemove?: () => void;
};

export const Pill = ({ label, onRemove }: PillProps) => {
    return (
        <span
            className='d-inline-flex align-items-center px-2 py-1'
            style={{
                backgroundColor: '#000',
                borderRadius: '8px',
                fontSize: '1rem',
                color: '#fff',
            }}
        >
            {label}
            {onRemove && (
                <button
                    type='button'
                    className='btn-close btn-close-white ms-2'
                    aria-label='Remove'
                    onClick={onRemove}
                />
            )}
        </span>
    );
};
