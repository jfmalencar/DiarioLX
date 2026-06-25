import type { ReactNode } from 'react';

import type { ContentSummary } from '@/shared/services/contents/contents.types';
import { usePageTheme } from '@/shared/hooks/usePageTheme';

import { HeroArticle } from '@/shared/components/HeroArticle';
import { ContentCard } from '@/shared/components/ContentCard';
import { ContentListSkeleton } from './ContentListSkeleton';

type Props = {
    title: string;
    contents: ContentSummary[];
    loading: boolean;
    error: string | null;
    emptyMessage?: string;
    color?: string;
    icon?: ReactNode;
    /** Dark header/hero only (videos, podcasts). */
    dark?: boolean;
    /** Dark whole page, grid included (photo essays). Implies a dark header too. */
    fullDark?: boolean;
}

export const ContentListPage = ({ title, color = '#000', icon, dark = false, fullDark = false, contents, loading, error, emptyMessage = 'Não há conteúdos para mostrar.' }: Props) => {
    usePageTheme(dark || fullDark ? 'dark' : 'light');

    // `dark` only tints the header; `fullDark` tints the entire page. When the
    // whole page is dark the header inherits it, so it doesn't need its own tint.
    const pageClass = fullDark ? 'bg-black text-white min-vh-100' : '';
    const headerClass = !fullDark && dark ? 'bg-black text-white' : '';

    if (loading) {
        return <ContentListSkeleton />;
    }
    if (error || contents.length === 0) {
        return (
            <div className={pageClass}>
                <div className={headerClass}>
                    <div className="container-xl px-lg-5 pt-5 pb-4" style={{ maxWidth: 1200 }}>
                        <h1 className='fw-bold pb-1 mb-3 d-flex align-items-center gap-3' style={{ color, borderBottom: `2px solid ${color}` }}>
                            {icon}
                            {title}
                        </h1>
                    </div>
                </div>
                <div className='py-5 text-center text-muted'>{emptyMessage}</div>
            </div>
        )
    }

    const [lead, ...rest] = contents;
    return (
        <div className={pageClass}>
            <div className={headerClass}>
                <div className="container-xl px-lg-5 pt-5 pb-4" style={{ maxWidth: 1200 }}>
                    <h1 className='fw-bold pb-1 mb-3 d-flex align-items-center gap-3' style={{ color, borderBottom: `2px solid ${color}` }}>
                        {icon}
                        {title}
                    </h1>
                    <HeroArticle content={lead} />
                </div>
            </div>
            <div className="container-xl px-lg-5 pb-5" style={{ maxWidth: 1200 }}>
                <div className='row g-3 mt-2'>
                    {rest.map((c) => (
                        <div key={c.id} className='col-12 col-sm-6 col-md-4'>
                            <ContentCard content={c} variant='vertical' dark={fullDark} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
