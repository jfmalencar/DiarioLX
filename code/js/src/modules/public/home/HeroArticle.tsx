import type { Article } from "./Home";

type Props = {
    article: Article;
}

export const HeroArticle = ({ article }: Props) => (
    <div
        className='position-relative overflow-hidden'
        style={{ maxHeight: '520px' }}
    >
        <img
            src={article.imageUrl}
            alt={article.imageAlt ?? article.title}
            className='w-100 object-fit-cover'
            style={{ height: '520px', objectFit: 'cover' }}
        />
        <div
            className='position-absolute bottom-0 start-0 w-100'
            style={{
                background:
                    'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                height: '70%',
            }}
        />
        <div className='position-absolute bottom-0 start-0 p-3 p-md-4 p-lg-5 w-100'>
            <div className='container-xl'>
                <span
                    className='badge text-uppercase mb-2'
                    style={{
                        backgroundColor: '#e63946',
                        letterSpacing: '0.1em',
                        fontSize: '0.65rem',
                    }}
                >
                    {article.category}
                </span>
                <h1
                    className='text-white fw-bold lh-sm mb-2'
                    style={{
                        fontSize: 'clamp(1.4rem, 4vw, 2.6rem)',
                        maxWidth: '780px',
                    }}
                >
                    {article.title}
                </h1>
                {article.excerpt && (
                    <p
                        className='text-white-50 mb-3 d-none d-md-block'
                        style={{ maxWidth: '620px', fontSize: '0.95rem' }}
                    >
                        {article.excerpt}
                    </p>
                )}
                <a
                    href={article.href ?? '#'}
                    className='btn btn-sm btn-outline-light'
                    style={{ fontSize: '0.78rem', letterSpacing: '0.06em' }}
                >
                    Ler mais →
                </a>
            </div>
        </div>
    </div>
);
