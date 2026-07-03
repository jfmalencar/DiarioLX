import { embedSrc, detectProvider } from '@/shared/utils/embed';

type Props = {
    url: string;
    title?: string;
    className?: string;
};

export const EmbedPlayer = ({ url, title = 'Conteúdo incorporado', className }: Props) => {
    const src = embedSrc(url);
    const provider = detectProvider(url);

    if (!src) {
        return (
            <a href={url} target='_blank' rel='noreferrer' className='text-decoration-underline'>
                {url}
            </a>
        );
    }

    if (provider === 'spotify') {
        return (
            <iframe
                src={src}
                title={title}
                className={className}
                style={{ width: '100%', height: 352, border: 0, borderRadius: 12 }}
                loading='lazy'
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            />
        );
    }

    return (
        <div className={className} style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
            <iframe
                src={src}
                title={title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, borderRadius: 8 }}
                loading='lazy'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
            />
        </div>
    );
};
