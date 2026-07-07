import { type Dispatch } from 'react';

import {
    Plus,
    Type,
    Quote,
    Heading3,
    Heading4,
    Image as ImageIcon,
    Images as ImagesIcon,
    MonitorPlay,
    Film,
    Music,
} from 'lucide-react';

import { useI18n } from '@/shared/hooks/useI18n';

import type { EditContentAction } from './EditContent.types';

type Props = {
    afterId?: number;
    dispatch: Dispatch<EditContentAction>;
    loading: boolean;
    inline?: boolean;
}

export const AddMenu = ({ afterId, dispatch, loading, inline = false }: Props) => {
    const { t } = useI18n();

    return (
    <div className={`add-menu dropdown ${inline ? '' : 'add-menu--always-visible d-flex justify-content-center my-2'}`} >
        <button
            type='button'
            className={`add-menu__toggle btn btn-sm p-0 d-flex align-items-center justify-content-center ${inline ? '' : 'btn-light border rounded-circle'}`}
            style={inline ? { width: 22, height: 22 } : { width: 28, height: 28 }}
            data-bs-toggle='dropdown'
            aria-expanded='false'
            aria-label={t('posts.add_block')}
            disabled={loading}
        >
            <Plus size={inline ? 15 : 16} />
        </button>
        <ul className='dropdown-menu shadow-sm'>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() => dispatch({ type: 'add-text-block', afterId })}
                >
                    <Type size={16} /> {t('posts.block.text')}
                </button>
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() => dispatch({ type: 'add-quote-block', afterId })}
                >
                    <Quote size={16} /> {t('posts.block.quote')}
                </button>
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() =>
                        dispatch({ type: 'add-heading-block', level: 3, afterId })
                    }
                >
                    <Heading3 size={16} /> {t('posts.block.h3')}
                </button>
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() =>
                        dispatch({ type: 'add-heading-block', level: 4, afterId })
                    }
                >
                    <Heading4 size={16} /> {t('posts.block.h4')}
                </button>
            </li>
            <li>
                <hr className='dropdown-divider' />
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() =>
                        dispatch({ type: 'open-gallery', payload: 'block', afterId })
                    }
                >
                    <ImageIcon size={16} /> {t('posts.block.image')}
                </button>
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() =>
                        dispatch({ type: 'open-gallery', payload: 'gallery', afterId })
                    }
                >
                    <ImagesIcon size={16} /> {t('posts.block.gallery')}
                </button>
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() =>
                        dispatch({ type: 'open-gallery', payload: 'video-block', afterId })
                    }
                >
                    <Film size={16} /> {t('posts.video')}
                </button>
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() =>
                        dispatch({ type: 'open-gallery', payload: 'audio-block', afterId })
                    }
                >
                    <Music size={16} /> {t('posts.block.audio')}
                </button>
            </li>
            <li>
                <button
                    type='button'
                    className='dropdown-item d-flex align-items-center gap-2'
                    onClick={() => dispatch({ type: 'add-embed-block', afterId })}
                >
                    <MonitorPlay size={16} /> {t('posts.block.embed')}
                </button>
            </li>
        </ul>
    </div>
    );
};
