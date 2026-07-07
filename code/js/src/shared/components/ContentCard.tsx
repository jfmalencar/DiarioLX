import { Link } from 'react-router-dom';
import { CirclePlay, AudioLines } from 'lucide-react';

import type { ContentSummary } from '@/shared/services/contents/contents.types';

import { contentHref, contentAccent, contentThumbnail, isVideoThumbnail, contentDate } from '../utils/content';
import { MediaPreview } from './MediaPreview';
import { PlayOverlay } from './PlayOverlay';

type Props = {
    content: ContentSummary;
    variant?: 'vertical' | 'horizontal' | 'list' | 'mini' | 'overlay';
    dark?: boolean;
}

const playableIndicator = (content: ContentSummary) => {
    if (content.type === 'VIDEO') return <CirclePlay size={34} color='#D4E600' strokeWidth={1.5} />;
    if (content.type === 'PODCAST' || content.type === 'EPISODE') return <AudioLines size={34} color='#82EE64' strokeWidth={1.5} />;
    return null;
};

export const ContentCard = ({ content, variant = 'vertical', dark = false }: Props) => {
    const href = contentHref(content);
    const accent = contentAccent(content.type, content.category?.color);
    const thumb = contentThumbnail(content);
    const indicator = playableIndicator(content);

    if (variant === 'horizontal') {
        return (
            <Link to={href} className='d-flex gap-3 text-decoration-none text-dark mb-3' >
                <MediaPreview
                    src={thumb}
                    isVideo={isVideoThumbnail(content)}
                    alt={content.title}
                    className='flex-shrink-0 rounded-1 object-fit-cover'
                    style={{ width: 90, height: 65, objectFit: 'cover' }}
                />
                <div>
                    <span
                        className='d-block text-uppercase fw-semibold mb-1'
                        style={{
                            color: accent,
                            fontSize: '0.6rem',
                            letterSpacing: '0.1em',
                        }}
                    >
                        {content.tag?.name}
                    </span>
                    <p
                        className='mb-0 lh-sm fw-semibold'
                        style={{ fontSize: '0.85rem' }}
                    >
                        {content.title}
                    </p>
                </div>
            </Link>
        );
    }
    if (variant === 'list') {
        return (
            <Link to={href} className='d-flex gap-3 text-decoration-none text-dark align-items-start'>
                <div className='position-relative flex-shrink-0'>
                    <MediaPreview
                        src={thumb}
                        isVideo={isVideoThumbnail(content)}
                        alt={content.title}
                        className='rounded-1 object-fit-cover'
                        style={{ width: 130, height: 110, objectFit: 'cover', display: 'block' }}
                    />
                    {indicator && <PlayOverlay placement='corner' size={30} icon={indicator} />}
                </div>
                <div className='flex-grow-1'>
                    <div className='d-flex justify-content-between align-items-baseline gap-2 mb-1'>
                        <span
                            className='text-uppercase fw-bold text-truncate'
                            style={{ color: accent, fontSize: '0.62rem', letterSpacing: '0.1em' }}
                        >
                            {content.tag?.name}
                        </span>
                        <span
                            className='fw-bold flex-shrink-0'
                            style={{ color: accent, fontSize: '0.62rem', letterSpacing: '0.04em' }}
                        >
                            {contentDate(content)}
                        </span>
                    </div>
                    <h3 className='mb-0 lh-sm fw-semibold' style={{ fontSize: '1.05rem' }}>
                        {content.title}
                    </h3>
                </div>
            </Link>
        );
    }
    if (variant === 'overlay') {
        return (
            <Link to={href} className='text-decoration-none d-block h-100'>
                <div className='position-relative overflow-hidden' style={{ aspectRatio: '16 / 10' }}>
                    <MediaPreview
                        src={thumb}
                        isVideo={isVideoThumbnail(content)}
                        alt={content.title}
                        className='position-absolute top-0 start-0 w-100 h-100'
                        style={{ objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    {indicator && (
                        <div className='position-absolute top-0 end-0 m-2 m-md-3' style={{ pointerEvents: 'none' }}>
                            {indicator}
                        </div>
                    )}
                    <div
                        className='position-absolute bottom-0 start-0 end-0 p-3'
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)' }}
                    >
                        <div className='d-flex justify-content-between align-items-baseline gap-2 mb-1'>
                            <span
                                className='text-uppercase fw-bold text-truncate'
                                style={{ color: accent, fontSize: '0.62rem', letterSpacing: '0.1em' }}
                            >
                                {content.tag?.name}
                            </span>
                            <span className='fw-bold' style={{ color: accent, fontSize: '0.62rem', letterSpacing: '0.04em' }}>
                                {contentDate(content)}
                            </span>
                        </div>
                        <h3 className='text-white mb-0 lh-sm fw-semibold' style={{ fontSize: '1rem' }}>
                            {content.title}
                        </h3>
                    </div>
                </div>
            </Link>
        );
    }
    if (variant === 'mini') {
        return (
            <Link
                to={href}
                className='d-flex gap-2 text-decoration-none text-dark align-items-start pb-2 border-bottom mb-2'
            >
                <div className='flex-grow-1'>
                    <span
                        className='d-block text-uppercase fw-bold mb-1'
                        style={{
                            color: accent,
                            fontSize: '0.58rem',
                            letterSpacing: '0.1em',
                        }}
                    >
                        {content.tag?.name}
                    </span>
                    <p
                        className='mb-0 lh-sm'
                        style={{ fontSize: '0.82rem' }}
                    >
                        {content.title}
                    </p>
                </div>
            </Link>
        );
    }
    return (
        <Link to={href} className={`text-decoration-none ${dark ? 'text-white' : 'text-dark'} h-100`}>
            <div className={`card border-0 h-100${dark ? ' bg-transparent' : ''}`}>
                <div className='position-relative overflow-hidden' style={{ maxHeight: 200 }}>
                    <MediaPreview
                        src={thumb}
                        isVideo={isVideoThumbnail(content)}
                        alt={content.title}
                        className='card-img-top object-fit-cover'
                        style={{ height: 250, objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    {indicator && <PlayOverlay placement='corner' size={40} icon={indicator} />}
                </div>
                <div className='card-body px-0 pt-2 pb-0'>
                    <div className='d-flex justify-content-between align-items-baseline gap-2 mb-1'>
                        <span
                            className='text-uppercase fw-bold text-truncate'
                            style={{ color: accent, fontSize: '0.6rem', letterSpacing: '0.1em' }}
                        >
                            {content.tag?.name}
                        </span>
                        <span className='fw-bold' style={{ color: accent, fontSize: '0.6rem', letterSpacing: '0.04em' }}>
                            {contentDate(content)}
                        </span>
                    </div>
                    <h3
                        className={dark ? 'text-white' : 'text-dark' + ' card-title mb-1 lh-sm'}
                        style={{ fontSize: '0.95rem' }}
                    >
                        {content.title}
                    </h3>
                </div>
            </div>
        </Link>
    );
};
