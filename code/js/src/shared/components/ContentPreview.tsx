import { Link } from 'react-router-dom';
import { usePath } from '@/shared/hooks/usePath';
import type { Content } from '@/shared/hooks/useContents';

const formatNewsDate = (dateString: string): string => {
    const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    return `${day} ${MONTHS[d.getMonth()]}`;
};

type Props = {
    content: Content;
};

export const ContentPreview = ({ content }: Props) => {
    const { buildMediaUrl } = usePath();

    const heroImageUrl = content.featuredImage?.path ? buildMediaUrl(content.featuredImage.path) : '';
    const category = content.category.name?.toUpperCase();
    const authors = content.authors.map(author => author.name);
    const credits = content.featuredImage?.credits || [];
    const date = formatNewsDate(content.createdAt);

    return (
        <div className='bg-light min-vh-100 py-2 py-md-5'>
            <div className='container px-4 px-md-5'>
                <section className='row g-4 g-lg-5 align-items-start mb-5'>
                    <div className='col-12 col-lg-6'>
                        {content.type === 'VIDEO' ? (
                            <video
                                src={`${heroImageUrl}#t=1`}
                                controls
                                preload='metadata'
                                className='w-100 rounded'
                            />
                        ) : (
                            <img
                                src={heroImageUrl}
                                alt={content.title}
                                className='img-fluid w-100'
                                style={{ objectFit: 'cover', maxHeight: 520 }}
                            />
                        )}
                    </div>

                    <div className='col-12 col-lg-6 d-flex flex-column justify-content-start pt-lg-4'>
                        <div className='d-flex justify-content-between align-items-start mb-3'>
                            <span className='fw-semibold' style={{ color: '#59c9f5', fontSize: '0.95rem', letterSpacing: '0.02em' }}>
                                {category}
                            </span>
                            <span className='fw-medium' style={{ color: '#59c9f5', fontSize: '0.9rem' }}>
                                {date}
                            </span>
                        </div>

                        <h1 className='fw-semibold lh-1 mb-3' style={{ fontSize: 'clamp(1.8rem, 2.8vw, 3rem)', maxWidth: 780 }}>
                            {content.title}
                        </h1>

                        <p className='mb-0' style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.6rem)', lineHeight: 1.35, maxWidth: 820 }}>
                            {content.headline}
                        </p>
                    </div>
                </section>

                <hr className='border-dark opacity-50 my-4 my-md-5' />

                <section className='row'>
                    <aside className='col-12 col-lg-3 mb-4 mb-lg-0'>
                        <div className='border-start ps-3'>
                            <div className='text-uppercase mb-4' style={{ fontSize: '0.9rem', lineHeight: 1.3 }}>
                                <div>POR {authors[0]}</div>
                                {authors.slice(1).map((author) => (
                                    <div key={author} className='fw-semibold'>{author}</div>
                                ))}
                            </div>
                            <div className='text-uppercase mb-4' style={{ fontSize: '0.9rem', lineHeight: 1.3 }}>
                                {credits.map(credit =>
                                    credit.role === 'photographer'
                                        ? `FOTOGRAFIA POR ${credit.name}`
                                        : `CRÉDITOS: ${credit.name} (${credit.role})`
                                ).join(' | ')}
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
                        <div style={{ fontSize: 'clamp(1.05rem, 1.15vw, 1.35rem)', lineHeight: 1.55, color: '#1d1d1d', maxWidth: 760 }}>
                            {content.blocks.map((block, index) => {
                                if (block.type === 'IMAGE') {
                                    return (
                                        <>
                                            <img
                                                key={index}
                                                src={buildMediaUrl(block.media.path)}
                                                alt={block.media.altText}
                                                className='img-fluid mb-4'
                                            />
                                            <div className='text-uppercase mb-4' style={{ fontSize: '0.9rem', lineHeight: 1.3, fontFamily: 'Sora' }}>
                                                {block.media.credits.map(credit =>
                                                    credit.role === 'photographer'
                                                        ? `FOTOGRAFIA POR ${credit.name}`
                                                        : `CRÉDITOS: ${credit.name} (${credit.role})`
                                                )}
                                            </div>
                                        </>
                                    );
                                }
                                if (block.type === 'QUOTE') {
                                    return (
                                        <blockquote
                                            key={index}
                                            className='mb-4'
                                            style={{ fontStyle: 'italic', fontSize: 'clamp(1.1rem, 1.3vw, 1.4rem)', borderLeft: '3px solid #111', paddingLeft: '1rem', color: '#444' }}
                                            dangerouslySetInnerHTML={{ __html: block.content }}
                                        />
                                    );
                                }
                                if (block.type === 'H3') {
                                    return (
                                        <h3
                                            key={index}
                                            className='mb-3 mt-4'
                                            style={{ fontSize: 'clamp(1.3rem, 1.6vw, 1.6rem)', fontWeight: 600, lineHeight: 1.3 }}
                                            dangerouslySetInnerHTML={{ __html: block.content }}
                                        />
                                    );
                                }
                                if (block.type === 'H4') {
                                    return (
                                        <h4
                                            key={index}
                                            className='mb-3 mt-4'
                                            style={{ fontSize: 'clamp(1.1rem, 1.3vw, 1.3rem)', fontWeight: 600, lineHeight: 1.3 }}
                                            dangerouslySetInnerHTML={{ __html: block.content }}
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
                        <div style={{ fontFamily: 'Sora' }}>
                            <hr />
                            <div className='text-center my-4'>
                                <span className='fw-bold me-2'>TAGS</span>
                                {content.tags.map((tag) => (
                                    <Link key={tag.slug} to={`/tags/${tag.slug}`} className='text-dark text-decoration-underline mx-2'>
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                            <hr />
                        </div>
                    </article>
                </section>
            </div>
        </div>
    );
};
