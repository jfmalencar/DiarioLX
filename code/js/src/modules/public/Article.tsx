import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useArticles, type Article } from '@/shared/hooks/useArticles';

const formatNewsDate = (dateString: string): string => {
    const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
    const d = new Date(dateString)
    const day = String(d.getDate()).padStart(2, '0')
    return `${day} ${MONTHS[d.getMonth()]}`
}

export function Article() {
    const { slug } = useParams();
    const { fetchOne } = useArticles();
    const [article, setArticle] = useState<Article | undefined>();

    const heroImageUrl = `http://localhost:8333/${article?.featuredImage?.url}`;
    const category = article?.category.name?.toUpperCase();
    const title = article?.title
    const headline = article?.headline
    const authors = article?.authors.map(author => author.name) || []
    const photographer = article?.featuredImage?.photographer || { name: 'Unknown' };
    const date = article ? formatNewsDate(article.createdAt) : ''

    useEffect(() => {
        const loadArticle = async () => {
            if (slug) {
                const fetchedArticle = await fetchOne(slug);
                setArticle(fetchedArticle);
            }
        };
        loadArticle();
    }, [fetchOne, slug]);

    return (
        <div className='bg-light min-vh-100 py-2 py-md-5'>
            <div className='container px-4 px-md-5'>
                <section className='row g-4 g-lg-5 align-items-start mb-5'>
                    <div className='col-12 col-lg-6'>
                        <img
                            src={heroImageUrl}
                            alt={title}
                            className='img-fluid w-100'
                            style={{
                                objectFit: 'cover',
                                maxHeight: 520,
                            }}
                        />
                    </div>

                    <div className='col-12 col-lg-6 d-flex flex-column justify-content-start pt-lg-4'>
                        <div className='d-flex justify-content-between align-items-start mb-3'>
                            <span
                                className='fw-semibold'
                                style={{
                                    color: '#59c9f5',
                                    fontSize: '0.95rem',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                {category}
                            </span>

                            <span
                                className='fw-medium'
                                style={{
                                    color: '#59c9f5',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {date}
                            </span>
                        </div>

                        <h1
                            className='fw-semibold lh-1 mb-3'
                            style={{
                                fontSize: 'clamp(1.8rem, 2.8vw, 3rem)',
                                maxWidth: 780,
                            }}
                        >
                            {title}
                        </h1>

                        <p
                            className='mb-0'
                            style={{
                                fontSize: 'clamp(1.1rem, 1.5vw, 1.6rem)',
                                lineHeight: 1.35,
                                maxWidth: 820,
                            }}
                        >
                            {headline}
                        </p>
                    </div>
                </section>
                <hr className='border-dark opacity-50 my-4 my-md-5' />
                <section className='row'>
                    <aside className='col-12 col-lg-3 mb-4 mb-lg-0'>
                        <div className='border-start ps-3'>
                            <div
                                className='text-uppercase mb-4'
                                style={{ fontSize: '0.9rem', lineHeight: 1.3 }}
                            >
                                <div>POR {authors[0]}</div>
                                {authors.slice(1).map((author) => (
                                    <div key={author} className='fw-semibold'>
                                        {author}
                                    </div>
                                ))}
                            </div>

                            <div
                                className='text-uppercase mb-4'
                                style={{ fontSize: '0.9rem', lineHeight: 1.3 }}
                            >
                                FOTOGRAFIA POR <span className='fw-semibold'>{photographer.name}</span>
                            </div>

                            <div className='d-flex gap-3'>
                                {['𝕏', 'f', '◎', '↻'].map((icon, index) => (
                                    <button
                                        key={index}
                                        type='button'
                                        className='btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center p-0'
                                        style={{ width: 36, height: 36, fontSize: '0.95rem' }}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                    <article className='font-noticia col-12 col-lg-7 offset-lg-1'>
                        <div
                            style={{
                                fontSize: 'clamp(1.05rem, 1.15vw, 1.35rem)',
                                lineHeight: 1.55,
                                color: '#1d1d1d',
                                maxWidth: 760,
                            }}
                        >
                            {article?.blocks.map((block, index) => {
                                if (block.type === 'image') {
                                    return (
                                        <img
                                            key={index}
                                            src={`http://localhost:8333/${block.media.url}`}
                                            alt={block.media.altText}
                                            className='img-fluid mb-4'
                                        />
                                    );
                                }
                                return (
                                    <p
                                        key={index}
                                        className={`mb-4 ${index === 0 ? 'dropcap' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: block.content }}
                                    />
                                );
                            })}
                        </div>
                    </article>
                </section>
            </div>
        </div >
    );
}