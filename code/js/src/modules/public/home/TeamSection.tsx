import { useTeam } from '@/shared/hooks/useTeam';
import { usePath } from '@/shared/hooks/usePath';

import { SectionHeader } from './SectionHeader'

const resolvePhoto = (path: string | null, buildMediaUrl: (p: string) => string) =>
    !path ? 'https://placehold.co/213x213' : path.startsWith('http') ? path : buildMediaUrl(path);

export const TeamSection = () => {
    const { team } = useTeam();
    const { buildMediaUrl } = usePath();

    if (team.length === 0) return null;

    return (
        <div className='container-diariolx'>
            <SectionHeader title='Equipa' href='/team' />
            <div className='row g-3 justify-content-center'>
                {team.slice(0, 4).map((m) => (
                    <div key={m.id} className='col-6 col-sm-4 col-md-3 text-center'>
                        <img
                            src={resolvePhoto(m.photoPath, buildMediaUrl)}
                            alt={m.name}
                            className='rounded-circle mb-2 object-fit-cover'
                            style={{
                                width: 150,
                                height: 150,
                                objectFit: 'cover',
                            }}
                        />
                        <p
                            className='mb-0 fw-semibold'
                            style={{
                                fontSize: '0.88rem',
                            }}
                        >
                            {m.name}
                        </p>
                        <small className='text-muted' style={{ fontSize: '0.7rem' }}>
                            {m.position}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
};
