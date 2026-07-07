import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

import type { ContentSummary } from '@/shared/services/contents/contents.types';
import { useContentsService } from '@/shared/services/contents';

import { contentHref, contentThumbnail, isVideoThumbnail } from '../utils/content';
import { MediaPreview } from './MediaPreview';

type Props = {
    onClose: () => void;
    headerHeight: number;
};

const PREVIEW_SIZE = 8;

type Result = { query: string; items: ContentSummary[] };

export const SearchOverlay = ({ onClose, headerHeight }: Props) => {
    const [term, setTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Result | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const contentsService = useContentsService();

    useEffect(() => {
        inputRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previous;
        };
    }, []);

    useEffect(() => {
        const query = term.trim();
        if (!query) return;
        const id = setTimeout(() => {
            setLoading(true);
            contentsService
                .fetchPublicContents({ query, size: PREVIEW_SIZE })
                .then((r) => setResult({ query, items: r.items }))
                .catch(() => setResult({ query, items: [] }))
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(id);
    }, [term, contentsService]);

    const submit = () => {
        const query = term.trim();
        if (!query) return;
        navigate(`/s?q=${encodeURIComponent(query)}`);
        onClose();
    };

    const query = term.trim();
    const current = result && result.query === query ? result : null;
    const showEmpty = !!query && !loading && !!current && current.items.length === 0;

    return (
        <div
            data-testid='search-overlay'
            className='position-fixed top-0 start-0 bg-white'
            style={{ width: '100vw', height: '100vh', zIndex: 2000, overflowY: 'auto' }}
        >
            <div className='container'>
                <div
                    className='d-flex align-items-center gap-3 border-bottom'
                    style={{ minHeight: headerHeight }}
                >
                    <Search size={22} className='text-muted flex-shrink-0' />
                    <input
                        ref={inputRef}
                        data-testid='search-input'
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') submit();
                        }}
                        placeholder='Pesquisar'
                        aria-label='Pesquisar'
                        className='form-control border-0 shadow-none fs-4 px-0'
                        style={{ outline: 'none' }}
                    />
                    <button
                        type='button'
                        aria-label='Fechar pesquisa'
                        onClick={onClose}
                        className='btn border-0 p-0 text-dark flex-shrink-0'
                        style={{ background: 'transparent' }}
                    >
                        <X size={26} />
                    </button>
                </div>
                <div className='py-3' style={{ margin: '0 auto' }}>
                    {showEmpty && (
                        <p className='text-muted py-4 mb-0'>
                            Não foram encontrados resultados para “{query}”.
                        </p>
                    )}
                    {current?.items.map((content) => (
                        <Link
                            key={content.id}
                            to={contentHref(content)}
                            onClick={onClose}
                            data-testid='search-result'
                            className='d-flex gap-3 align-items-center text-decoration-none text-dark py-3 border-bottom'
                        >
                            <MediaPreview
                                src={contentThumbnail(content)}
                                isVideo={isVideoThumbnail(content)}
                                alt={content.title}
                                className='flex-shrink-0 rounded-1 object-fit-cover'
                                style={{ width: 130, height: 80, objectFit: 'cover' }}
                            />
                            <h3 className='mb-0 fw-semibold lh-sm' style={{ fontSize: '1.15rem' }}>
                                {content.title}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
