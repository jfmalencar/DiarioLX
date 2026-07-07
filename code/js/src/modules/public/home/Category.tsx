import { Link } from 'react-router-dom';

import type { ContentSummary } from '@/shared/services/contents/contents.types';
import { ContentCard } from "@/shared/components/ContentCard";

type Props = {
    contents: ContentSummary[];
}

type CategoryGroup = {
    slug: string;
    name: string;
    span: number;
    items: ContentSummary[];
}

const buildGroups = (contents: ContentSummary[]): CategoryGroup[] => {
    const groups: CategoryGroup[] = [];
    for (const content of contents) {
        const { category } = content;
        const last = groups[groups.length - 1];
        if (last && category && last.slug === category.slug) {
            last.span += 1;
            last.items.push(content);
        } else {
            groups.push({ slug: category?.slug ?? '', name: category?.name ?? '', span: 1, items: [content] });
        }
    }
    return groups;
};

const SPAN_COL: Record<number, string> = {
    1: 'col-md-3',
    2: 'col-md-6',
    3: 'col-md-9',
    4: 'col-md-12',
};

export const CategoryRow = ({ contents }: Props) => {
    const items = contents.slice(0, 4);
    if (items.length === 0) return null;
    const groups = buildGroups(items);

    return (
        <div className='container-diariolx'>
            <div className='row g-4'>
                {groups.map((group, i) => (
                    <div key={`${group.slug}-${i}`} className={`col-12 ${SPAN_COL[group.span] ?? 'col-md-3'}`}>
                        <div className='d-flex align-items-baseline justify-content-between border-bottom border-2 border-dark pb-1 mb-3'>
                            <h3 className='mb-0 fw-bold' style={{ fontSize: '0.95rem' }}>
                                {group.name}
                            </h3>
                            <Link
                                to={`/c/${group.slug}`}
                                className='text-muted text-decoration-none'
                                style={{ fontSize: '0.65rem' }}
                            >
                                Ver todas →
                            </Link>
                        </div>
                        {/* Desktop: vertical cards laid out in the magazine grid. */}
                        <div className='row g-4 d-none d-md-flex'>
                            {group.items.map((content) => (
                                <div key={content.id} className={`col-md-${12 / group.span}`}>
                                    <ContentCard content={content} variant='vertical' />
                                </div>
                            ))}
                        </div>
                        {/* Mobile: stacked horizontal cards, one per row. */}
                        <div className='d-flex flex-column gap-4 d-md-none'>
                            {group.items.map((content) => (
                                <ContentCard key={content.id} content={content} variant='list' />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
