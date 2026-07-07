import { Link } from 'react-router-dom';

import type { ContentSummary } from '@/shared/services/contents/contents.types';
import { contentHref, contentAccent, contentThumbnail, isVideoThumbnail } from '@/shared/utils/content';

import { MediaPreview } from './MediaPreview';
import { PlayOverlay } from './PlayOverlay';

type Props = {
    content: ContentSummary;
}

export const HeroArticle = ({ content }: Props) => {
    return (
        <Link to={contentHref(content)} data-testid='hero-article' className='text-decoration-none text-dark'>
            <div
                className='position-relative overflow-hidden'
                style={{ maxHeight: '520px' }}
            >
                <MediaPreview
                    src={contentThumbnail(content)}
                    isVideo={isVideoThumbnail(content)}
                    alt={content.title}
                    className='w-100 object-fit-cover'
                    style={{ height: '520px', objectFit: 'cover' }}
                />
                {content.type === 'VIDEO' && <PlayOverlay placement='center' size={80} />}
                <div
                    className='position-absolute bottom-0 start-0 w-100'
                    style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                        height: '70%',
                    }}
                />
                <div className='position-absolute bottom-0 start-0 p-3 p-md-4 p-lg-5 w-100'>
                    <div className='container-xl'>
                        <span
                            className='badge text-uppercase mb-2'
                            style={{
                                borderRadius: 2,
                                backgroundColor: contentAccent(content.type, content.category?.color),
                                letterSpacing: '0.1em',
                                fontSize: '0.65rem',
                            }}
                        >
                            {content.tag?.name}
                        </span>
                        <div className='text-white'>
                            <h2
                                className='text-white fw-bold lh-sm mb-2 mt-3'
                                style={{
                                    fontSize: 'clamp(1.4rem, 4vw, 2.6rem)',
                                    maxWidth: '780px',
                                }}
                            >
                                {content.title}
                            </h2>
                            <p>
                                {content.headline}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
