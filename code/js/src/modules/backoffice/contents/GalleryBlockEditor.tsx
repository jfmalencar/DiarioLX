import { type Dispatch } from 'react';
import { Trash2, Plus } from 'lucide-react';

import { usePath } from '@/shared/hooks/usePath';
import { useI18n } from '@/shared/hooks/useI18n';
import type { ContentGalleryBlock } from '@/shared/services/contents/contents.types';

import type { EditContentAction } from './EditContent.types';

type Props = {
    block: ContentGalleryBlock;
    dispatch: Dispatch<EditContentAction>;
    loading: boolean;
};

export const GalleryBlockEditor = ({ block, dispatch, loading }: Props) => {
    const { buildMediaUrl } = usePath();
    const { t } = useI18n();

    return (
        <div className='border rounded p-3'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
                <span className='fw-semibold text-uppercase' style={{ fontSize: '0.85rem', letterSpacing: '0.06em' }}>
                    {t('posts.gallery')} · {block.images.length} {block.images.length === 1 ? t('posts.photo') : t('posts.photos')}
                </span>
                <button
                    type='button'
                    disabled={loading}
                    className='btn btn-sm btn-outline-dark d-flex align-items-center gap-1'
                    onClick={() => dispatch({ type: 'open-gallery-add-more', blockId: block.id })}
                >
                    <Plus size={14} /> {t('posts.add_more')}
                </button>
            </div>

            {block.images.length === 0 ? (
                <div className='text-muted text-center py-4'>{t('posts.gallery_empty')}</div>
            ) : (
                <div className='row g-3'>
                    {block.images.map((image, index) => (
                        <div key={`${image.media.id}-${index}`} className='col-6 col-md-4'>
                            <div className='position-relative'>
                                <img
                                    src={image.media.thumbnailPath ? buildMediaUrl(image.media.thumbnailPath) : buildMediaUrl(image.media.path)}
                                    alt={image.media.altText ?? ''}
                                    className='w-100'
                                    style={{ height: 140, objectFit: 'cover', display: 'block' }}
                                />
                                <button
                                    type='button'
                                    disabled={loading}
                                    aria-label={t('posts.remove_photo')}
                                    className='btn btn-dark position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center'
                                    onClick={() => dispatch({ type: 'remove-gallery-image', payload: { blockId: block.id, imageIndex: index } })}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <input
                                type='text'
                                className='form-control form-control-sm mt-1 rounded-0 border-0 border-bottom'
                                placeholder={t('posts.caption')}
                                value={image.caption ?? ''}
                                disabled={loading}
                                onChange={(e) =>
                                    dispatch({
                                        type: 'update-gallery-caption',
                                        payload: { blockId: block.id, imageIndex: index, caption: e.currentTarget.value },
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
