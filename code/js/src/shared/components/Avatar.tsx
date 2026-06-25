import { UserIcon } from 'lucide-react';

import { usePath } from '@/shared/hooks/usePath';

type Props = {
    src?: string | null;
    alt?: string;
    size?: number;
    className?: string;
};

// Circular user image with a lucide user-icon fallback (matching the backoffice
// user list) when there's no photo.
export const Avatar = ({ src, alt = '', size = 200, className = '' }: Props) => {
    const { buildMediaUrl } = usePath();

    if (src) {
        const url = src.startsWith('http') ? src : buildMediaUrl(src);
        return (
            <img
                src={url}
                alt={alt}
                className={`rounded-circle ${className}`}
                style={{ width: size, height: size, objectFit: 'cover' }}
            />
        );
    }

    return (
        <div
            className={`d-flex align-items-center justify-content-center rounded-circle border border-dark text-dark ${className}`}
            style={{ width: size, height: size }}
        >
            <UserIcon size={Math.round(size * 0.5)} strokeWidth={1.5} />
        </div>
    );
};
