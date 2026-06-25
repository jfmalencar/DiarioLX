import { Link } from 'react-router-dom';

import type { ContentSummary } from '@/shared/services/contents/contents.types';

import { contentHref, contentDate, contentAccent, contentThumbnail, isVideoThumbnail } from '@/shared/utils/content';

import { MediaPreview } from '@/shared/components/MediaPreview';

type Props = {
    title?: string;
    contents: ContentSummary[];
    verTodasHref?: string;
}

export const PrimarySection = ({ title, contents, verTodasHref = '#' }: Props) => {
    const [lead] = contents;
    return (
        <div className='container-diariolx'>
            <div className='dlx-lisboa-grid'>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    {lead && (
                        <MediaPreview
                            src={contentThumbnail(lead)}
                            isVideo={isVideoThumbnail(lead)}
                            alt={title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    )}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '1.5rem 1.75rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                        }}
                    >
                        <h2
                            style={{
                                fontWeight: 900,
                                fontSize: 'clamp(1.5rem, 2.8vw, 2.3rem)',
                                color: contentAccent(lead.type, lead.category?.color, '#fff'),
                                margin: 0,
                                lineHeight: 1.15,
                                textShadow: '0 1px 6px rgba(0,0,0,0.35)',
                            }}
                        >
                            {title}
                        </h2>
                        <Link
                            to={verTodasHref}
                            style={{
                                fontSize: '0.78rem',
                                color: '#fff',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                marginBottom: '0.1rem',
                            }}
                        >
                            Ver todas →
                        </Link>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #ddd' }}>
                    {contents.slice(0, 4).map((c, i) => (
                        <Link
                            key={c.id}
                            to={contentHref(c)}
                            style={{
                                display: 'block',
                                flex: 1,
                                textDecoration: 'none',
                                color: 'inherit',
                                padding: '1.1rem 1.4rem',
                                borderBottom: i < 3 ? '1px solid #ddd' : 'none',
                                transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLElement).style.background = '#f9f9f7')
                            }
                            onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLElement).style.background = 'transparent')
                            }
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '0.6rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        color: contentAccent(c.type, c.category?.color),
                                    }}
                                >
                                    {c.tag?.name}
                                </span>
                                <span
                                    style={{
                                        fontSize: '0.6rem',
                                        color: contentAccent(c.type, c.category?.color),
                                        letterSpacing: '0.04em',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '0.75rem',
                                    }}
                                >
                                    {contentDate(c)}
                                </span>
                            </div>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    lineHeight: 1.35,
                                    color: '#111',
                                }}
                            >
                                {c.title}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
