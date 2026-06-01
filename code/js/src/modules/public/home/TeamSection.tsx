import type { TeamMember } from './Home'
import { SectionHeader } from './SectionHeader'

type Props = {
    members: TeamMember[];
    href?: string;
}

export const TeamSection = ({ members, href = '#' }: Props) => (
    <div className='container-xl py-4'>
        <SectionHeader title='Equipa' href={href} />
        <div className='row g-3 justify-content-center'>
            {members.slice(0, 4).map((m) => (
                <div key={m.id} className='col-6 col-sm-4 col-md-3 text-center'>
                    <img
                        src={m.imageUrl}
                        alt={m.name}
                        className='rounded-circle mb-2 object-fit-cover'
                        style={{
                            width: 110,
                            height: 110,
                            objectFit: 'cover',
                            border: '3px solid #111',
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
                        {m.role}
                    </small>
                </div>
            ))}
        </div>
    </div>
);
