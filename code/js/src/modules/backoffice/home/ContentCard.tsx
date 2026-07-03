import { Link } from 'react-router';

import { Pencil, Trash2 } from 'lucide-react';

import { MediaPreview } from '@/shared/components/MediaPreview';

import type { ContentSummary } from '@/shared/services/contents/contents.types';
import { contentHref, contentAccent, contentThumbnail, isVideoThumbnail } from '@/shared/utils/content';

type Props = {
    content: ContentSummary | null;
    onEdit?: () => void;
    onRemove?: () => void;
    large?: boolean;
};

export const ContentCard = ({ content, onEdit, onRemove, large = false }: Props) => {
    const height = large ? 420 : 240;

    return (
        <div
            className='position-relative rounded-2 overflow-hidden bg-light border'
            style={{ height }}
        >
            <div className='position-absolute top-0 end-0 m-3 d-flex gap-2' style={{ zIndex: 2 }}>
                {onRemove && content && (
                    <button
                        type='button'
                        className='btn btn-dark btn-sm d-flex align-items-center justify-content-center rounded-3'
                        style={{ width: 36, height: 36 }}
                        onClick={onRemove}
                        aria-label='Remover conteúdo'
                    >
                        <Trash2 size={16} />
                    </button>
                )}
                {onEdit && (
                    <button
                        type='button'
                        className='btn btn-dark btn-sm d-flex align-items-center justify-content-center rounded-3'
                        style={{ width: 36, height: 36 }}
                        onClick={onEdit}
                        aria-label='Editar conteúdo'
                    >
                        <Pencil size={16} />
                    </button>
                )}
            </div>
            {content ? (
                <>
                    <MediaPreview
                        src={contentThumbnail(content)}
                        isVideo={isVideoThumbnail(content)}
                        alt=''
                        className='w-100 h-100'
                        style={{ objectFit: 'cover' }}
                    />
                    <Link
                        to={contentHref(content)}
                        target='_blank'
                        className='position-absolute bottom-0 start-0 w-100 text-white p-4 text-decoration-none'
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))' }}
                    >
                        <div
                            className='text-uppercase fw-bold mb-1'
                            style={{
                                color: contentAccent(content.type, content.category.color),
                                fontSize: large ? '0.9rem' : '0.75rem',
                                letterSpacing: '0.05em',
                            }}
                        >
                            {content.tag.name}
                        </div>
                        <div className='fw-bold lh-sm' style={{ fontSize: large ? '1.75rem' : '1.05rem' }}>
                            {content.title}
                        </div>
                        {large ?
                            <p>{content.headline}</p>
                            : null}
                    </Link>
                </>
            ) : (
                <div className='d-flex align-items-center justify-content-center h-100 text-secondary'>
                    Sem conteúdo definido
                </div>
            )}
        </div>
    );
};