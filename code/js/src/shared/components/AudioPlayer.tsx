import { useRef, useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw, AudioLines } from 'lucide-react';

import { usePath } from '@/shared/hooks/usePath';

type Props = {
    audioUrl: string;
    artworkUrl?: string | null;
    title: string;
    subtitle?: string;
    accent?: string;
};

const fmt = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const AudioPlayer = ({ audioUrl, artworkUrl, title, subtitle, accent = '#82EE64' }: Props) => {
    const { buildMediaUrl } = usePath();
    const audioRef = useRef<HTMLAudioElement>(null);

    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);

    const resolve = (p: string) => (p.startsWith('http') ? p : buildMediaUrl(p));
    const src = resolve(audioUrl);
    const artwork = artworkUrl ? resolve(artworkUrl) : null;
    const remaining = duration ? duration - current : 0;

    const toggle = () => {
        const a = audioRef.current;
        if (!a) return;
        if (a.paused) a.play();
        else a.pause();
    };

    const skip = (delta: number) => {
        const a = audioRef.current;
        if (!a) return;
        a.currentTime = Math.min(Math.max(0, a.currentTime + delta), duration || a.duration || 0);
    };

    const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
        const a = audioRef.current;
        if (!a) return;
        const value = Number(event.currentTarget.value);
        a.currentTime = value;
        setCurrent(value);
    };

    return (
        <div className='position-relative overflow-hidden' style={{ borderRadius: 16 }}>
            {artwork && (
                <div
                    className='position-absolute top-0 start-0 w-100 h-100'
                    style={{
                        backgroundImage: `url(${artwork})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(32px) saturate(1.4) brightness(0.55)',
                        transform: 'scale(1.3)',
                    }}
                />
            )}
            <div className='position-absolute top-0 start-0 w-100 h-100' style={{ background: 'rgba(0,0,0,0.42)' }} />

            <div className='position-relative p-3 p-md-4 text-white'>
                <div className='d-flex gap-3 gap-md-4 mb-4'>
                    {artwork ? (
                        <img
                            src={artwork}
                            alt=''
                            className='rounded-3 flex-shrink-0'
                            style={{ width: 'clamp(110px, 30%, 168px)', aspectRatio: '1', objectFit: 'cover' }}
                        />
                    ) : (
                        <div
                            className='rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center'
                            style={{ width: 'clamp(110px, 30%, 168px)', aspectRatio: '1', background: 'rgba(255,255,255,0.1)' }}
                        >
                            <AudioLines size={40} color={accent} />
                        </div>
                    )}
                    <div className='d-flex flex-column justify-content-center overflow-hidden'>
                        <div className='fw-bold lh-sm text-truncate' style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)' }}>
                            {title}
                        </div>
                        {subtitle && (
                            <div className='text-truncate mt-1' style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                                {subtitle}
                            </div>
                        )}
                    </div>
                </div>

                <div className='d-flex align-items-center gap-2 gap-md-3'>
                    <button type='button' className='btn btn-link text-white p-0 d-flex flex-shrink-0' aria-label='Recuar 15s' onClick={() => skip(-15)}>
                        <RotateCcw size={22} strokeWidth={1.75} />
                    </button>
                    <input
                        type='range'
                        min={0}
                        max={duration || 0}
                        value={current}
                        onChange={seek}
                        className='form-range flex-grow-1'
                        style={{ accentColor: '#fff' }}
                        aria-label='Posição'
                    />
                    <button type='button' className='btn btn-link text-white p-0 d-flex flex-shrink-0' aria-label='Avançar 15s' onClick={() => skip(15)}>
                        <RotateCw size={22} strokeWidth={1.75} />
                    </button>
                    <span className='flex-shrink-0 text-nowrap' style={{ fontSize: '0.8rem', minWidth: 52, textAlign: 'right' }}>
                        -{fmt(remaining)}
                    </span>
                    <button
                        type='button'
                        className='btn rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ms-1'
                        aria-label={playing ? 'Pausar' : 'Reproduzir'}
                        style={{ width: 56, height: 56, background: '#fff', color: '#000' }}
                        onClick={toggle}
                    >
                        {playing ? <Pause size={24} fill='currentColor' /> : <Play size={24} fill='currentColor' style={{ marginLeft: 3 }} />}
                    </button>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={src}
                preload='metadata'
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
            />
        </div>
    );
};
