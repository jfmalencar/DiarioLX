import type { ContentSummary } from '@/shared/services/contents/contents.types';

import { ContentCard } from './ContentCard';

type Props = {
    title: string;
    contents: ContentSummary[];
    hasMore?: boolean;
    loading?: boolean;
    onLoadMore?: () => void;
};

export const ContentGridSection = ({ title, contents, hasMore, loading, onLoadMore }: Props) => {
    if (contents.length === 0) return null;

    return (
        <section className='container-diariolx'>
            <h2
                className='font-noticia fw-semibold pb-2 mb-4 border-bottom border-dark'
                style={{ fontSize: '1.5rem' }}
            >
                {title}
            </h2>
            <div className='row g-3 g-md-4'>
                {contents.map((content) => (
                    <div key={content.id} className='col-6 col-md-3'>
                        <ContentCard content={content} variant='overlay' />
                    </div>
                ))}
            </div>
            {onLoadMore && hasMore && (
                <div className='border-top border-bottom mt-4 py-3 text-center'>
                    <button
                        type='button'
                        className='btn btn-link text-dark text-decoration-underline text-uppercase fw-semibold'
                        style={{ letterSpacing: '0.08em', fontSize: '0.85rem' }}
                        onClick={onLoadMore}
                        disabled={loading}
                    >
                        {loading ? 'A carregar…' : 'Carregar mais'}
                    </button>
                </div>
            )}
        </section>
    );
};
