export type EmbedProvider = 'youtube' | 'spotify';

export const detectProvider = (url: string): EmbedProvider | null => {
    const u = url.trim();
    if (/(?:youtube\.com|youtu\.be)/i.test(u)) return 'youtube';
    if (/open\.spotify\.com/i.test(u)) return 'spotify';
    return null;
};

export const youtubeId = (url: string): string | null => {
    const u = url.trim();
    const patterns = [
        /youtu\.be\/([\w-]{11})/i,
        /youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)([\w-]{11})/i,
    ];
    for (const p of patterns) {
        const m = u.match(p);
        if (m) return m[1];
    }
    return null;
};

const spotifyEmbedPath = (url: string): string | null => {
    const m = url.trim().match(/open\.spotify\.com\/(?:intl-\w+\/)?(\w+)\/([\w]+)/i);
    return m ? `${m[1]}/${m[2]}` : null;
};

export const embedSrc = (url: string): string | null => {
    const provider = detectProvider(url);
    if (provider === 'youtube') {
        const id = youtubeId(url);
        return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (provider === 'spotify') {
        const path = spotifyEmbedPath(url);
        return path ? `https://open.spotify.com/embed/${path}` : null;
    }
    return null;
};

export const youtubeThumb = (url: string): string | null => {
    const id = youtubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
};
