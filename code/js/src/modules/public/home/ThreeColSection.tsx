import type { ContentSummary } from '@/shared/services/contents/contents.types';
import { ContentCard } from '@/shared/components/ContentCard';

import { SectionHeader } from './SectionHeader'

type Props = {
    title: string;
    contents: ContentSummary[];
    href?: string;
}

export const ThreeColSection = ({ title, contents, href = '#' }: Props) => (
    <div className='container-diariolx'>
        <SectionHeader title={title} href={href} />
        <div className='row g-3'>
            {contents.slice(0, 3).map((c) => (
                <div key={c.id} className='col-12 col-sm-6 col-md-4'>
                    <ContentCard content={c} variant='vertical' />
                </div>
            ))}
        </div>
    </div>
);
