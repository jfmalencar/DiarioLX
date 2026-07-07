import { Link } from 'react-router-dom';

import { useTeam } from '@/shared/hooks/useTeam';
import { Avatar } from '@/shared/components/Avatar';

import { SectionHeader } from './SectionHeader'

export const TeamSection = () => {
    const { team } = useTeam();

    if (team.length === 0) return null;

    return (
        <div className='container-diariolx'>
            <SectionHeader title='Equipa' href='/team' />
            <div className='row g-3 justify-content-center'>
                {team.slice(0, 4).map((m) => (
                    <div key={m.id} className='col-6 col-sm-4 col-md-3 text-center'>
                        <Link to={`/a/${m.slug}`} className='text-decoration-none text-dark d-flex flex-column align-items-center'>
                            <Avatar src={m.photoPath} alt={m.name} size={150} className='mb-2' />
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
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};
