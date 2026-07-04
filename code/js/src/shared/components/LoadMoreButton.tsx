type Props = {
    onClick: () => void;
    loading?: boolean;
    dark?: boolean;
    className?: string;
};

export const LoadMoreButton = ({ onClick, loading = false, dark = false, className = '' }: Props) => (
    <div className={`text-center ${className}`}>
        <button
            type='button'
            data-testid='load-more'
            className={`btn btn-outline-${dark ? 'light' : 'dark'} rounded-0 px-4 py-2 text-uppercase`}
            style={{ letterSpacing: '0.08em', fontSize: '0.85rem' }}
            onClick={onClick}
            disabled={loading}
        >
            {loading ? 'A carregar…' : 'Ver mais'}
        </button>
    </div>
);
