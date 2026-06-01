import type { Article } from "./Home";

type Props = {
    articles: Article[];
    verTodasHref?: string;
}

export const Latest = ({ articles, verTodasHref = "#" }: Props) => (
    <div className='container-xl py-4'>
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
            <a
                href={verTodasHref}
                style={{ fontSize: "0.78rem", color: "#111", textDecoration: "none" }}
            >
                Ver todas →
            </a>
        </div>
        <div className="dlx-ultimas-grid">
            {articles.slice(0, 4).map((a, i) => (
                <a
                    key={a.id}
                    href={a.href ?? "#"}
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
                            style={{
                                fontSize: "0.62rem",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: i === 3 ? "#c8a000" : "#555",
                            }}
                        >
                            {a.category}
                        </span>
                        <span
                            style={{
                                fontSize: "0.62rem",
                                color: i === 3 ? "#c8a000" : "#888",
                                letterSpacing: "0.04em",
                                whiteSpace: "nowrap",
                                marginLeft: "0.5rem",
                            }}
                        >
                            {a.date}
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
                        {a.title}
                    </p>
                </a>
            ))}
        </div>
    </div>
);
