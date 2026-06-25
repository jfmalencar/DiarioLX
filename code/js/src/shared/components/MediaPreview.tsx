import type { CSSProperties, MouseEventHandler } from 'react';
import { ImageOff } from 'lucide-react';

import { usePath } from '@/shared/hooks/usePath';

type Props = {
    src: string | null;
    thumbnail?: string | null;
    isVideo?: boolean;
    preview?: boolean;
    alt?: string;
    className?: string;
    style?: CSSProperties;
    onMouseEnter?: MouseEventHandler<HTMLElement>;
    onMouseLeave?: MouseEventHandler<HTMLElement>;
}

const resolveUrl = (path: string, build: (p: string) => string) => path.startsWith('http') ? path : build(path);

export const MediaPreview = ({ src, thumbnail, isVideo = false, preview = true, alt = '', className, style, onMouseEnter, onMouseLeave }: Props) => {
    const { buildMediaUrl } = usePath();
    const resolve = (path: string) => resolveUrl(path, buildMediaUrl);

    if (thumbnail) {
        return (
            <img
                src={resolve(thumbnail)}
                alt={alt}
                className={className}
                style={style}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        );
    }
    if (!src) {
        return (
            <div
                className={`d-flex align-items-center justify-content-center bg-body-secondary ${className ?? ''}`}
                style={style}
            >
                <ImageOff size={28} color='#adb5bd' />
            </div>
        );
    }
    if (isVideo) {
        const url = resolve(src);
        return (
            <video
                src={preview ? `${url}#t=1` : url}
                muted
                preload='metadata'
                className={className}
                style={style}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        );
    }
    return (
        <img
            src={resolve(src)}
            alt={alt}
            className={className}
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    );
};
