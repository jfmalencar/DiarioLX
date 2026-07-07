import type { ReactNode } from 'react';

import type { ContentSummary } from '@/shared/services/contents/contents.types';
import { usePageTheme } from '@/shared/hooks/usePageTheme';
import { useI18n } from '@/shared/hooks/useI18n';

import { HeroArticle } from '@/shared/components/HeroArticle';
import { ContentCard } from '@/shared/components/ContentCard';
import { LoadMoreButton } from '@/shared/components/LoadMoreButton';
import { ContentListSkeleton } from './ContentListSkeleton';

type Props = {
    title: string;
    contents: ContentSummary[];
    loading: boolean;
    error: string | null;
    emptyMessage?: string;
    color?: string;
    icon?: ReactNode;
    dark?: boolean;
    fullDark?: boolean;
    hasMore?: boolean;
    loadingMore?: boolean;
    onLoadMore?: () => void;
}

export const ContentListPage = ({ title, color = '#000', icon, dark = false, fullDark = false, contents, loading, error, emptyMessage, hasMore = false, loadingMore = false, onLoadMore }: Props) => {
    usePageTheme(dark || fullDark ? 'dark' : 'light');
    const { t } = useI18n();
    const resolvedEmptyMessage = emptyMessage ?? t('listing.empty');

    const pageClass = fullDark ? 'bg-black text-white' : '';
    const headerClass = !fullDark && dark ? 'bg-black text-white' : '';
    const emptyClass = fullDark ? 'py-5 text-center text-white' : ' py-5 text-center text-muted';

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
                <div className={emptyClass}>
                    {resolvedEmptyMessage}
                </div>
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
                        <div key={c.id} data-testid='content-card' className='col-12 col-sm-6 col-md-4'>
                            <ContentCard content={c} variant='vertical' dark={fullDark} />
                        </div>
                    ))}
                </div>
                {onLoadMore && hasMore && (
                    <LoadMoreButton onClick={onLoadMore} loading={loadingMore} dark={fullDark} className='mt-5' />
                )}
            </div>
        </div>
    );
};
