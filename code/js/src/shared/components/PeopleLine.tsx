import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

type Person = { name: string; slug?: string | null };

type Props = {
    label: string;
    people: Person[];
    className?: string;
    style?: CSSProperties;
};

export const PeopleLine = ({ label, people, className, style }: Props) => {
    if (people.length === 0) return null;
    return (
        <div className={className} style={style}>
            <span className='opacity-50 me-1'>{label}</span>
            {people.map((person, index) => (
                <span key={`${person.slug ?? person.name}-${index}`}>
                    {index > 0 && ', '}
                    {person.slug ? (
                        <Link to={`/author/${person.slug}`} className='text-reset text-decoration-none fw-semibold'>
                            {person.name}
                        </Link>
                    ) : (
                        <span className='fw-semibold'>{person.name}</span>
                    )}
                </span>
            ))}
        </div>
    );
};
