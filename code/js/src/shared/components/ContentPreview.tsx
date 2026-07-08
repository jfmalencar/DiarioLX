import { Link } from 'react-router-dom';
import { AudioLines } from 'lucide-react';

import { usePath } from '@/shared/hooks/usePath';
import { contentAccent } from '@/shared/utils/content';
import { groupCredits } from '@/shared/utils/credits';
import { formatDate } from '@/shared/utils/format';

import { useCreditLabel } from '@/shared/hooks/useCreditLabel';
import { useI18n } from '@/shared/hooks/useI18n';
import { useSnackbar } from '@/shared/hooks/useSnackbar';
import { PeopleLine } from '@/shared/components/PeopleLine';
import { GalleryViewer } from '@/shared/components/GalleryViewer';
import { PodcastEpisodes } from '@/shared/components/PodcastEpisodes';
import { AudioPlayer } from '@/shared/components/AudioPlayer';
import { EmbedPlayer } from '@/shared/components/EmbedPlayer';
import { usePageTheme } from '@/shared/hooks/usePageTheme';
import type { Content } from '@/shared/hooks/useContents';

type Props = {
    content: Content;
};

export const ContentPreview = ({ content }: Props) => {
    const { buildMediaUrl } = usePath();
    const creditLabel = useCreditLabel();
    const { showSnackbar } = useSnackbar();
    const { t } = useI18n();

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const openShare = (url: string) => window.open(url, '_blank', 'noopener,noreferrer,width=600,height=520');
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            showSnackbar(t('content.link_copied'), 'success');
        } catch {
            showSnackbar(t('content.link_copy_error'), 'error');
        }
    };
    const shareActions = [
        {
            icon: '𝕏',
            label: t('content.share_x'),
            onClick: () =>
                openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(content.title)}&url=${encodeURIComponent(shareUrl)}`),
        },
        {
            icon: 'f',
            label: t('content.share_facebook'),
            onClick: () => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`),
        },
        {
            icon: '◎',
            label: t('content.share_whatsapp'),
            onClick: () => openShare(`https://wa.me/?text=${encodeURIComponent(`${content.title} ${shareUrl}`)}`),
        },
        {
            icon: '↻',
            label: t('content.copy_link'),
            onClick: copyLink,
        },
    ];

    const isVideo = content.type === 'VIDEO';
    const isPodcast = content.type === 'PODCAST';
    const isEpisode = content.type === 'EPISODE';
    const isPhotoEssay = content.type === 'PHOTO_ESSAY';
    const isDark = isVideo || isPodcast || isEpisode || isPhotoEssay;

    const heroImageUrl = content.featuredImage?.path ? buildMediaUrl(content.featuredImage.path) : '';
    const category = content.category.name?.toUpperCase();
    const credits = content.featuredImage?.credits || [];
    const date = formatDate(new Date(content.publishedAt ?? content.createdAt));
    const wasUpdatedAfterPublish = content.publishedAt != null && content.updatedAt.slice(0, 10) > content.publishedAt.slice(0, 10);
    const accent = contentAccent(content.type, content.category?.color);
    const episodeArtwork = content.parent?.image ?? null;

    usePageTheme(isDark ? 'dark' : 'light');

    return (
        <div className={`min-vh-100 ${isPhotoEssay ? 'bg-black' : 'bg-light'}`}>
            {isPodcast ? (
                <header className='bg-black text-white'>
                    <div className='position-relative'>
                        <img
                            src={heroImageUrl}
                            alt={content.title}
                            className='w-100 container px-4 px-md-5'
                            style={{ height: 'min(70vh, 640px)', objectFit: 'cover', display: 'block' }}
                        />
                        <div
                            className='position-absolute bottom-0 start-0 end-0'
                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)' }}
                        >
                            <div className='container px-4 px-md-5 pt-5 pb-4 pb-md-5'>
                                <div className='ms-3'>
                                    <div className='d-flex align-items-center gap-3'>
                                        <AudioLines size={52} color={accent} strokeWidth={1.5} className='flex-shrink-0' />
                                        <h1 className='fw-semibold mt-0 mb-0 lh-1' style={{ color: accent, fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
                                            {content.title}
                                        </h1>
                                    </div>
                                    {content.headline && (
                                        <p className='text-white mb-0 mt-3' style={{ maxWidth: 820 }}>
                                            {content.headline}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            ) : (
                <div className={isDark ? 'bg-black text-white' : 'bg-light'}>
                    <div className='container px-4 px-md-5 py-4 py-md-5'>
                        <section className='row g-4 g-lg-5 align-items-start'>
                            <div className='col-12 col-lg-7'>
                                {isVideo ? (
                                    content.embedUrl ? (
                                        <EmbedPlayer url={content.embedUrl} title={content.title} />
                                    ) : (
                                        <video
                                            src={`${heroImageUrl}#t=1`}
                                            controls
                                            preload='metadata'
                                            className='w-100 rounded'
                                        />
                                    )
                                ) : isEpisode ? (
                                    content.embedUrl ? (
                                        <EmbedPlayer url={content.embedUrl} title={content.title} />
                                    ) : (
                                        <AudioPlayer
                                            audioUrl={content.featuredImage?.path ?? ''}
                                            artworkUrl={episodeArtwork}
                                            title={content.title}
                                            subtitle={content.parent ? `${date} · ${content.parent.title.toUpperCase()}` : date}
                                            accent={accent}
                                        />
                                    )
                                ) : (
                                    <img
                                        src={heroImageUrl}
                                        alt={content.title}
                                        className='img-fluid w-100'
                                        style={{ objectFit: 'cover', maxHeight: 520 }}
                                    />
                                )}
                            </div>
                            <div className='col-12 col-lg-5 d-flex flex-column justify-content-start pt-lg-4'>
                                <div className='d-flex justify-content-between align-items-start'>
                                    {isEpisode && content.parent ? (
                                        <Link
                                            to={`/p/${content.parent.slug}`}
                                            className='fw-semibold text-decoration-none'
                                            style={{ color: accent, fontSize: '0.95rem', letterSpacing: '0.02em' }}
                                        >
                                            {content.parent.title.toUpperCase()}
                                        </Link>
                                    ) : (
                                        <Link
                                            to={`/c/${content.category.slug}`}
                                            className='fw-semibold text-decoration-none'
                                            style={{ color: accent, fontSize: '0.95rem', letterSpacing: '0.02em' }}
                                        >
                                            {category}
                                        </Link>
                                    )}
                                    <span className='fw-medium' style={{ color: accent, fontSize: '0.9rem' }}>
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
                    </div>
                </div>
            )}
            <div className={isPhotoEssay ? 'bg-black text-white' : 'bg-light'}>
                <div className='container px-4 px-md-5 py-4 py-md-5'>
                    {!isDark && <hr className='border-dark opacity-50 mt-0 mb-4 mb-md-5' />}
                    <section className='row'>
                        <aside className='col-12 col-lg-3 mb-4 mb-lg-0'>
                            <div className='border-start ps-3'>
                                <div className='mb-4' style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    <PeopleLine label={t('content.by')} people={content.authors} className='text-uppercase mb-2' />
                                    {groupCredits(credits, creditLabel).map((group) => (
                                        <PeopleLine
                                            key={group.role}
                                            label={group.label}
                                            people={group.people}
                                            className='text-uppercase mb-2'
                                        />
                                    ))}
                                </div>
                                {wasUpdatedAfterPublish && (
                                    <p className='text-uppercase mb-4' style={{ fontSize: '0.78rem', opacity: 0.65, letterSpacing: '0.04em' }}>
                                        {t('content.updated_at', { date: formatDate(new Date(content.updatedAt)) })}
                                    </p>
                                )}
                                <div className='d-flex gap-3'>
                                    {shareActions.map((action) => (
                                        <button
                                            key={action.label}
                                            type='button'
                                            aria-label={action.label}
                                            title={action.label}
                                            onClick={action.onClick}
                                            className={`btn btn-outline-${isPhotoEssay ? 'light' : 'dark'} rounded-circle d-flex align-items-center justify-content-center p-0`}
                                            style={{ width: 36, height: 36, fontSize: '0.95rem' }}
                                        >
                                            {action.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>
                        <article className='font-noticia col-12 col-lg-7 offset-lg-1'>
                            <div style={{ fontSize: 'clamp(1.05rem, 1.15vw, 1.35rem)', lineHeight: 1.55, color: isPhotoEssay ? '#eaeaea' : '#1d1d1d', maxWidth: 760 }}>
                                {content.blocks.map((block, index) => {
                                    if (block.type === 'GALLERY') {
                                        return <GalleryViewer key={index} images={block.images} />;
                                    }
                                    if (block.type === 'EMBED') {
                                        return (
                                            <div key={index} className='my-4'>
                                                <EmbedPlayer url={block.content} title={content.title} />
                                            </div>
                                        );
                                    }
                                    if (block.type === 'MEDIA') {
                                        const url = buildMediaUrl(block.media.path);
                                        const media = block.media.mimeType.startsWith('video') ? (
                                            <video src={url} controls preload='metadata' className='w-100 rounded mb-4' />
                                        ) : block.media.mimeType.startsWith('audio') ? (
                                            <audio src={url} controls className='w-100 mb-4' />
                                        ) : (
                                            <img src={url} alt={block.media.altText} className='img-fluid mb-4' />
                                        );
                                        return (
                                            <div key={index}>
                                                {media}
                                                <div className='mb-4' style={{ fontSize: '0.9rem', lineHeight: 1.5, fontFamily: 'Sora' }}>
                                                    {groupCredits(block.media.credits, creditLabel).map((group) => (
                                                        <PeopleLine
                                                            key={group.role}
                                                            label={group.label}
                                                            people={group.people}
                                                            className='text-uppercase'
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    if (block.type === 'QUOTE') {
                                        return (
                                            <blockquote
                                                key={index}
                                                className='mb-4'
                                                style={{ fontStyle: 'italic', fontSize: 'clamp(1.1rem, 1.3vw, 1.4rem)', borderLeft: `3px solid ${isPhotoEssay ? '#fff' : '#111'}`, paddingLeft: '1rem', color: isPhotoEssay ? '#cfcfcf' : '#444' }}
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
                            <div>
                                <hr />
                                <div className='text-center my-4'>
                                    <span className='fw-bold me-2'>{t('content.tags')}</span>
                                    {content.tags.map((tag) => (
                                        <Link key={tag.slug} to={`/t/${tag.slug}`} className={`${isPhotoEssay ? 'text-white' : 'text-dark'} text-decoration-underline mx-2`}>
                                            {tag.name}
                                        </Link>
                                    ))}
                                </div>
                                <hr />
                            </div>
                        </article>
                    </section>
                </div>
                {isPodcast && (
                    <PodcastEpisodes podcastId={content.id} />
                )}
            </div>
        </div>
    );
};
