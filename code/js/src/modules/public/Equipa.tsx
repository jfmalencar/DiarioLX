import { Link } from 'react-router-dom';

import { useTeam } from '@/shared/hooks/useTeam';
import { usePath } from '@/shared/hooks/usePath';

const resolvePhoto = (path: string | null, buildMediaUrl: (p: string) => string) =>
    !path ? 'https://placehold.co/213x213' : path.startsWith('http') ? path : buildMediaUrl(path);

export function Equipa() {
    const { team, loading, error } = useTeam();
    const { buildMediaUrl } = usePath();

    if (loading) {
        return <div className='container py-5 text-center text-muted'>A carregar…</div>;
    }
    if (error || team.length === 0) {
        return <div className='container py-5 text-center text-muted'>Não há membros da equipa para mostrar.</div>;
    }

    return (
        <div className='container py-5'>
            <h1 className='fw-bold border-bottom border-2 border-dark pb-2 mb-5'>Equipa</h1>
            {team.map((m) => (
                <div key={m.id} className='row g-4 mb-5 align-items-start'>
                    <div className='col-12 col-md-3 text-center text-md-start'>
                        <Link to={`/author/${m.slug}`}>
                            <img
                                src={resolvePhoto(m.photoPath, buildMediaUrl)}
                                alt={m.name}
                                className='rounded-circle object-fit-cover'
                                style={{ width: 200, height: 200, objectFit: 'cover' }}
                            />
                        </Link>
                    </div>
                    <div className='col-12 col-md-9'>
                        <h2 className='fw-bold mb-1' style={{ fontSize: '2rem' }}>
                            <Link to={`/author/${m.slug}`} className='text-dark text-decoration-none'>
                                {m.name}
                            </Link>
                        </h2>
                        <p className='fw-bold mb-3'>{m.position}</p>
                        <hr className='border-dark opacity-25' />
                        <p
                            className='mb-0'
                            style={{
                                fontFamily: '"Source Serif 4", Georgia, serif',
                                fontSize: '1.1rem',
                                lineHeight: 1.6,
                            }}
                        >
                            {m.bio}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
