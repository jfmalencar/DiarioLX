import type { ContentSummary } from '@/shared/services/contents/contents.types';

import { ContentCard } from '@/shared/components/ContentCard';

import { SectionHeader } from './SectionHeader'

type Props = {
    title?: string;
    href?: string;
    contents: ContentSummary[];
}

export const SecondarySection = ({ title = 'A Fundo', href = '#', contents }: Props) => {
    const [main, ...rest] = contents;
    return (
        <div className='container-diariolx'>
            <SectionHeader title={title} href={href} />
            <div className='row g-3'>
                {main && (
                    <div className='col-12 col-md-6'>
                        <ContentCard content={main} variant='vertical' />
                    </div>
                )}
                <div className='col-12 col-md-6'>
                    {rest.slice(0, 4).map((c) => (
                        <ContentCard key={c.id} content={c} variant='horizontal' />
                    ))}
                </div>
            </div>
        </div>
    );
};
