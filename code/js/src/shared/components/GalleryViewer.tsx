import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { usePath } from '@/shared/hooks/usePath';
import type { GalleryImage } from '@/shared/services/contents/contents.types';

type Props = {
    images: GalleryImage[];
};

const photographerOf = (image: GalleryImage): string | null => {
    const credit = image.media.credits?.find((c) => c.role === 'photographer');
    return credit ? credit.name : null;
};

export const GalleryViewer = ({ images }: Props) => {
    const { buildMediaUrl } = usePath();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (images.length === 0) return null;

    const close = () => setActiveIndex(null);
    const prev = () => setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    const next = () => setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));

    const active = activeIndex !== null ? images[activeIndex] : null;

    return (
        <>
            <div className='my-4'>
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 992: 3 }}>
                    <Masonry gutter='12px'>
                        {images.map((image, index) => (
                            <div
                                key={`${image.media.id}-${index}`}
                                className='overflow-hidden cursor-pointer'
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Abrir fotografia ${index + 1}`}
                            >
                                <img
                                    src={image.media.thumbnailPath ? buildMediaUrl(image.media.thumbnailPath) : buildMediaUrl(image.media.path)}
                                    alt={image.media.altText ?? ''}
                                    style={{ width: '100%', display: 'block' }}
                                />
                            </div>
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </div>
            {active && (
                <div
                    className='position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center'
                    style={{ backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 1080 }}
                    onClick={close}
                    role='dialog'
                >
                    <button
                        type='button'
                        className='btn text-white position-absolute top-0 end-0 m-3'
                        aria-label='Fechar'
                        onClick={close}
                    >
                        <X size={28} />
                    </button>

                    <button
                        type='button'
                        className='btn text-white position-absolute start-0 top-50 translate-middle-y ms-2 ms-md-4'
                        aria-label='Anterior'
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                    >
                        <ChevronLeft size={40} />
                    </button>

                    <figure className='m-0 text-center' style={{ maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={buildMediaUrl(active.media.path)}
                            alt={active.media.altText ?? ''}
                            style={{ maxWidth: '90vw', maxHeight: '78vh', objectFit: 'contain' }}
                        />
                        <figcaption className='text-white-50 mt-3 px-3' style={{ fontFamily: 'Sora', fontSize: '0.9rem' }}>
                            {active.caption && <span className='text-white'>{active.caption}</span>}
                            {photographerOf(active) && (
                                <span className='d-block text-uppercase mt-1' style={{ fontSize: '0.8rem' }}>
                                    Fotografia por {photographerOf(active)}
                                </span>
                            )}
                            <span className='d-block mt-1'>{(activeIndex ?? 0) + 1} / {images.length}</span>
                        </figcaption>
                    </figure>

                    <button
                        type='button'
                        className='btn text-white position-absolute end-0 top-50 translate-middle-y me-2 me-md-4'
                        aria-label='Seguinte'
                        onClick={(e) => { e.stopPropagation(); next(); }}
                    >
                        <ChevronRight size={40} />
                    </button>
                </div>
            )}
        </>
    );
};
