import type { Article } from "./Home";
import { SectionHeader } from './SectionHeader'
import { ArticleCard } from './ArticleCard'

type Props = {
    title: string;
    articles: Article[];
    href?: string;
    showPlayIcon?: boolean;
}

export const ThreeColSection = ({
    title,
    articles,
    href = '#',
    showPlayIcon = false,
}: Props) => (
    <div className='container-xl py-4'>
        <SectionHeader title={title} href={href} />
        <div className='row g-3'>
            {articles.slice(0, 3).map((a) => (
                <div key={a.id} className='col-12 col-sm-6 col-md-4'>
                    {showPlayIcon ? (
                        <a
                            href={a.href ?? '#'}
                            className='text-decoration-none text-dark d-block'
                        >
                            <div className='position-relative overflow-hidden rounded-2 mb-2'>
                                <img
                                    src={a.imageUrl}
                                    alt={a.imageAlt ?? a.title}
                                    className='w-100 object-fit-cover'
                                    style={{ height: 170, objectFit: 'cover' }}
                                />
                                <div className='position-absolute top-50 start-50 translate-middle'>
                                    <div
                                        className='d-flex align-items-center justify-content-center rounded-circle'
                                        style={{
                                            width: 44,
                                            height: 44,
                                            backgroundColor: 'rgba(230,57,70,0.9)',
                                        }}
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='18'
                                            height='18'
                                            fill='white'
                                            viewBox='0 0 16 16'
                                        >
                                            <path d='M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z' />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <span
                                className='d-block text-uppercase fw-bold mb-1'
                                style={{
                                    color: '#e63946',
                                    fontSize: '0.58rem',
                                    letterSpacing: '0.1em',
                                }}
                            >
                                {a.category}
                            </span>
                            <p
                                className='mb-0 lh-sm'
                                style={{
                                    fontSize: '0.88rem',
                                }}
                            >
                                {a.title}
                            </p>
                        </a>
                    ) : (
                        <ArticleCard article={a} variant='vertical' />
                    )}
                </div>
            ))}
        </div>
    </div>
);
