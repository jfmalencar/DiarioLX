import type { Article } from './Home'

type Props = {
    categoryImageUrl: string;
    categoryImageAlt?: string;
    articles: Article[];
    verTodasHref?: string;
}

export const LisboaCidadeAbertaSection = ({
    categoryImageUrl,
    categoryImageAlt = "Lisboa, Cidade Aberta",
    articles,
    verTodasHref = "#",
}: Props) => (
    <div className='container-xl py-4'>
        <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Source+Serif+4:wght@300;400;600&display=swap"
            rel="stylesheet"
        />
        <div className="dlx-lisboa-grid">
            <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                    src={categoryImageUrl}
                    alt={categoryImageAlt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "1.5rem 1.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                    }}
                >
                    <h2
                        style={{
                            fontWeight: 900,
                            fontSize: "clamp(1.5rem, 2.8vw, 2.3rem)",
                            color: "#00d4e0",
                            margin: 0,
                            lineHeight: 1.15,
                            textShadow: "0 1px 6px rgba(0,0,0,0.35)",
                        }}
                    >
                        Lisboa,<br />Cidade Aberta
                    </h2>
                    <a
                        href={verTodasHref}
                        style={{
                            fontSize: "0.78rem",
                            color: "#fff",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            marginBottom: "0.1rem",
                        }}
                    >
                        Ver todas →
                    </a>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", borderLeft: "1px solid #ddd" }}>
                {articles.slice(0, 4).map((a, i) => (
                    <a
                        key={a.id}
                        href={a.href ?? "#"}
                        style={{
                            display: "block",
                            flex: 1,
                            textDecoration: "none",
                            color: "inherit",
                            padding: "1.1rem 1.4rem",
                            borderBottom: i < 3 ? "1px solid #ddd" : "none",
                            transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.background = "#f9f9f7")
                        }
                        onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.background = "transparent")
                        }
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                marginBottom: "0.5rem",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "#00a8b5",
                                }}
                            >
                                {a.category}
                            </span>
                            <span
                                style={{
                                    fontSize: "0.6rem",
                                    color: "#888",
                                    letterSpacing: "0.04em",
                                    whiteSpace: "nowrap",
                                    marginLeft: "0.75rem",
                                }}
                            >
                                {a.date}
                            </span>
                        </div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "1rem",
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
    </div>
);
