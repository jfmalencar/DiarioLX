import { useParams } from 'react-router-dom';

import { useAuthorProfile } from '@/shared/hooks/useAuthorProfile';
import { useContentList } from '@/shared/hooks/useContentList';
import { ContentCard } from '@/shared/components/ContentCard';
import { Avatar } from '@/shared/components/Avatar';
import type { ContentSummary } from '@/shared/services/contents/contents.types';

const Grid = ({ items }: { items: ContentSummary[] }) => (
    <div className='row g-3 mb-5'>
        {items.map((c) => (
            <div key={c.id} className='col-12 col-sm-6 col-md-4'>
                <ContentCard content={c} variant='vertical' />
            </div>
        ))}
    </div>
);

const SectionTitle = ({ children }: { children: string }) => (
    <h2 className='fw-bold border-bottom border-2 border-dark pb-2 mb-4' style={{ fontSize: '1.5rem' }}>
        {children}
    </h2>
);

export function Author() {
    const { slug } = useParams();
    const { author: member, loading: authorLoading, error: authorError } = useAuthorProfile(slug);
    const { contents: written, loading: writtenLoading } = useContentList({ author: slug });
    const { contents: credited, loading: creditedLoading } = useContentList({ creditedTo: slug });

    if (authorLoading) {
        return <div className='container py-5 text-center text-muted'>A carregar…</div>;
    }

    if (authorError || !member) {
        return <div className='container py-5 text-center text-muted'>Autor não encontrado.</div>;
    }

    const loadingContent = writtenLoading || creditedLoading;
    const isEmpty = !loadingContent && written.length === 0 && credited.length === 0;

    return (
        <div className='container py-5'>
            <div className='row g-4 mb-5 align-items-start'>
                <div className='col-12 col-md-3 text-center text-md-start'>
                    <Avatar src={member.photoPath} alt={member.name} size={200} />
                </div>
                <div className='col-12 col-md-9'>
                    <h1 className='fw-bold mb-1' style={{ fontSize: '2.4rem' }}>
                        {member.name}
                    </h1>
                    <p className='fw-bold mb-3'>{member.position}</p>
                    <hr className='border-dark opacity-25' />
                    <p
                        className='mb-0'
                        style={{
                            fontFamily: '"Source Serif 4", Georgia, serif',
                            fontSize: '1.1rem',
                            lineHeight: 1.6,
                        }}
                    >
                        {member.bio}
                    </p>
                </div>
            </div>

            {loadingContent && <div className='py-4 text-center text-muted'>A carregar…</div>}

            {written.length > 0 && (
                <>
                    <SectionTitle>Publicações</SectionTitle>
                    <Grid items={written} />
                </>
            )}

            {credited.length > 0 && (
                <>
                    <SectionTitle>Créditos</SectionTitle>
                    <Grid items={credited} />
                </>
            )}

            {isEmpty && (
                <div className='py-4 text-center text-muted'>Este autor ainda não tem publicações.</div>
            )}
        </div>
    );
}
