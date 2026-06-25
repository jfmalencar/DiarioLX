import { Link } from 'react-router-dom';

import type { ContentSummary } from '@/shared/services/contents/contents.types';
import { ContentCard } from "@/shared/components/ContentCard";

type Props = {
    contents: ContentSummary[];
}

type CategoryRun = {
    slug: string;
    name: string;
    span: number;
}

const buildRuns = (contents: ContentSummary[]): CategoryRun[] => {
    const runs: CategoryRun[] = [];
    for (const { category } of contents) {
        const last = runs[runs.length - 1];
        if (last && category && last.slug === category.slug) {
            last.span += 1;
        } else {
            runs.push({ slug: category?.slug ?? '', name: category?.name ?? '', span: 1 });
        }
    }
    return runs;
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
    const runs = buildRuns(items);

    return (
        <div className='container-diariolx'>
            <div className='row g-4 d-none d-md-flex mb-0'>
                {runs.map((run, i) => (
                    <div key={`${run.slug}-${i}`} className={SPAN_COL[run.span] ?? 'col-md-3'}>
                        <div className='d-flex align-items-baseline justify-content-between border-bottom border-2 border-dark pb-1'>
                            <h3 className='mb-0 fw-bold' style={{ fontSize: '0.95rem' }}>
                                {run.name}
                            </h3>
                            <Link
                                to={`/category/${run.slug}`}
                                className='text-muted text-decoration-none'
                                style={{ fontSize: '0.65rem' }}
                            >
                                Ver todas →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className='row g-4 mt-0'>
                {items.map((content) => (
                    <div key={content.id} className='col-6 col-md-3'>
                        <ContentCard content={content} variant='vertical' />
                    </div>
                ))}
            </div>
        </div>
    );
};
