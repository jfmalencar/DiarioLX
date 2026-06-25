import { Link } from 'react-router-dom';

import type { ContentSummary } from '@/shared/services/contents/contents.types';

import { contentHref, contentDate } from '@/shared/utils/content';

type Props = {
    contents: ContentSummary[];
    verTodasHref?: string;
}

export const Latest = ({ contents, verTodasHref = "#" }: Props) => (
    <div className='container-diariolx'>
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: "1.5px solid #111",
                paddingBottom: "0.5rem",
                marginBottom: "1.25rem",
            }}
        >
            <h2
                style={{
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    margin: 0,
                }}
            >
                Últimas
            </h2>
            <Link
                to={verTodasHref}
                style={{ fontSize: "0.78rem", color: "#111", textDecoration: "none" }}
            >
                Ver todas →
            </Link>
        </div>
        <div className="dlx-ultimas-grid">
            {contents.slice(0, 4).map((c, i) => (
                <Link
                    key={c.id}
                    to={contentHref(c)}
                    className={`dlx-ultimas-col${i < 3 ? " dlx-ultimas-col--bordered" : ""}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            marginBottom: "0.45rem",
                        }}
                    >
                        <span
                            className='fw-bold'
                            style={{
                                fontSize: "0.62rem",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: c.category?.color ?? "#111",
                            }}
                        >
                            {c.category?.name}
                        </span>
                        <span
                            className='fw-bold'
                            style={{
                                fontSize: "0.62rem",
                                color: c.category?.color ?? "#111",
                                letterSpacing: "0.04em",
                                whiteSpace: "nowrap",
                                marginLeft: "0.5rem",
                            }}
                        >
                            {contentDate(c)}
                        </span>
                    </div>
                    <p
                        style={{
                            margin: 0,
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            lineHeight: 1.35,
                            color: "#111",
                        }}
                    >
                        {c.title}
                    </p>
                </Link>
            ))}
        </div>
    </div>
);
