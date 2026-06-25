import type { ContentSummary } from '@/shared/services/contents/contents.types';

import { ContentCard } from '@/shared/components/ContentCard';

type Props = {
    contents: ContentSummary[];
}

export const FeaturedGrid = ({ contents }: Props) => (
    <div className='container-diariolx'>
        <div className='row g-3'>
            {contents.slice(0, 3).map((c) => (
                <div key={c.id} className='col-12 col-sm-6 col-md-4'>
                    <ContentCard content={c} variant='vertical' />
                </div>
            ))}
        </div>
    </div>
);
