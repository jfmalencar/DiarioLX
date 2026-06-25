import { ContentCard } from './ContentCard';
import type { ContentSummary } from '@/shared/services/contents/contents.types';

type Props = {
    label: string;
    slots: (ContentSummary | null)[];
    onEditSlot: (index: number) => void;
};

export const ContentTypeZone = ({ label, slots, onEditSlot }: Props) => {
    return (
        <div>
            <h2 className='fw-bold border-bottom border-2 border-dark pb-2 mb-4 mt-5'>{label}</h2>
            <div className='row g-4'>
                {slots.map((content, i) => (
                    <div className='col-12 col-md-4' key={i}>
                        <ContentCard content={content} onEdit={() => onEditSlot(i)} />
                    </div>
                ))}
            </div>
        </div>
    );
};
