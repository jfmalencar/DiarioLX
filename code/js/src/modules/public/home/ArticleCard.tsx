import type { Article } from "./Home";

type Props = {
    article: Article;
    variant?: 'vertical' | 'horizontal' | 'mini';
    showExcerpt?: boolean;
}

export const ArticleCard = ({ article, variant = 'vertical', showExcerpt = false }: Props) => {
    if (variant === 'horizontal') {
        return (
            <a
                href={article.href ?? '#'}
                className='d-flex gap-3 text-decoration-none text-dark mb-3'
            >
                <img
                    src={article.imageUrl}
                    alt={article.imageAlt ?? article.title}
                    className='flex-shrink-0 rounded-1 object-fit-cover'
                    style={{ width: 90, height: 65, objectFit: 'cover' }}
                />
                <div>
                    <span
                        className='d-block text-uppercase fw-semibold mb-1'
                        style={{
                            color: '#e63946',
                            fontSize: '0.6rem',
                            letterSpacing: '0.1em',
                        }}
                    >
                        {article.category}
                    </span>
                    <p
                        className='mb-0 lh-sm fw-semibold'
                        style={{
                            fontSize: '0.85rem',
                        }}
                    >
                        {article.title}
                    </p>
                    {article.readTime && (
                        <small className='text-muted' style={{ fontSize: '0.7rem' }}>
                            {article.readTime}
                        </small>
                    )}
                </div>
            </a>
        );
    }

    if (variant === 'mini') {
        return (
            <a
                href={article.href ?? '#'}
                className='d-flex gap-2 text-decoration-none text-dark align-items-start pb-2 border-bottom mb-2'
            >
                <div className='flex-grow-1'>
                    <span
                        className='d-block text-uppercase fw-bold mb-1'
                        style={{
                            color: '#e63946',
                            fontSize: '0.58rem',
                            letterSpacing: '0.1em',
                        }}
                    >
                        {article.category}
                    </span>
                    <p
                        className='mb-0 lh-sm'
                        style={{
                            fontSize: '0.82rem',
                        }}
                    >
                        {article.title}
                    </p>
                </div>
                {article.readTime && (
                    <small
                        className='text-muted flex-shrink-0'
                        style={{ fontSize: '0.65rem' }}
                    >
                        {article.readTime}
                    </small>
                )}
            </a>
        );
    }

    // vertical (default)
    return (
        <a href={article.href ?? '#'} className='text-decoration-none text-dark h-100'>
            <div className='card border-0 h-100'>
                <div className='overflow-hidden' style={{ maxHeight: 200 }}>
                    <img
                        src={article.imageUrl}
                        alt={article.imageAlt ?? article.title}
                        className='card-img-top object-fit-cover'
                        style={{
                            height: 250,
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease',
                        }}
                        onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLImageElement).style.transform =
                            'scale(1.05)')
                        }
                        onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLImageElement).style.transform =
                            'scale(1)')
                        }
                    />
                </div>
                <div className='card-body px-0 pt-2 pb-0'>
                    <span
                        className='d-block text-uppercase fw-bold mb-1'
                        style={{
                            color: '#e63946',
                            fontSize: '0.6rem',
                            letterSpacing: '0.1em',
                        }}
                    >
                        {article.category}
                    </span>
                    <h3
                        className='card-title mb-1 lh-sm'
                        style={{
                            fontSize: '0.95rem',
                        }}
                    >
                        {article.title}
                    </h3>
                    {showExcerpt && article.excerpt && (
                        <p className='card-text text-muted' style={{ fontSize: '0.8rem' }}>
                            {article.excerpt}
                        </p>
                    )}
                    {article.readTime && (
                        <small className='text-muted' style={{ fontSize: '0.7rem' }}>
                            {article.readTime}
                        </small>
                    )}
                </div>
            </div>
        </a>
    );
};