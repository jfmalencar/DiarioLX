CREATE TABLE IF NOT EXISTS  categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20) NOT NULL UNIQUE,
    parent_id INTEGER NULL,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    archived_at BIGINT DEFAULT NULL,

    CONSTRAINT fk_parent_category
        FOREIGN KEY (parent_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

CREATE VIEW v_categories AS
SELECT
    c.id,
    c.name,
    c.slug,
    c.description,
    c.color,
    c.parent_id,
    p.name AS parentName,
    0 AS quantity,
    c.created_at,
    c.updated_at,
    c.archived_at
FROM categories c LEFT JOIN categories p ON c.parent_id = p.id;

CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    description TEXT,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    archived_at BIGINT DEFAULT NULL
);

CREATE VIEW v_tags AS
SELECT
    t.id,
    t.name,
    t.slug,
    t.description,
    0 AS quantity,
    t.created_at,
    t.updated_at,
    t.archived_at
FROM tags t;

CREATE TABLE media (
    id                    SERIAL PRIMARY KEY,
    type                  VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'audio')),
    original_file_name    TEXT NOT NULL,
    bucket                TEXT NOT NULL,
    object_key            TEXT NOT NULL,
    thumbnail_bucket      TEXT NULL,
    thumbnail_object_key  TEXT NULL,
    alt_text              VARCHAR(255) NULL,
    mime_type             VARCHAR(100) NULL,
    status                VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'ready')),
    size_bytes            BIGINT,
    created_at            BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    uploaded_at           BIGINT DEFAULT NULL
);

CREATE TABLE articles (
    id                SERIAL PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    headline          TEXT,
    featured_media_id INTEGER NULL REFERENCES media(id),
    slug              VARCHAR(255) NOT NULL UNIQUE,
    category_id       INTEGER NOT NULL REFERENCES categories(id),
    published_at      BIGINT NULL,
    created_at        BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at        BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_slug ON articles(slug);

CREATE TABLE authors (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255),
    bio             TEXT NULL,
    avatar_url      TEXT NULL,
    created_at      BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at      BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

CREATE TABLE article_authors (
    article_id      INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    author_id       INTEGER NOT NULL REFERENCES authors(id),
    role            VARCHAR(20) NOT NULL CHECK (role IN ('primary', 'secondary')),
    PRIMARY KEY (article_id, author_id)
);

CREATE INDEX idx_article_authors_article_id ON article_authors(article_id);
CREATE INDEX idx_article_authors_author_id ON article_authors(author_id);

CREATE TABLE article_blocks (
    id              SERIAL PRIMARY KEY,
    article_id      INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('text', 'quote', 'image')),
    content         TEXT NULL,
    media_id        INTEGER NULL REFERENCES media(id),
    position        INTEGER NOT NULL,

    created_at      BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at      BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),

    CONSTRAINT uq_article_blocks_article_position UNIQUE (article_id, position),
    CONSTRAINT chk_article_blocks_content CHECK (
        (type IN ('text', 'quote') AND content IS NOT NULL)
            OR
        (type = 'image' AND media_id IS NOT NULL)
        )
);

CREATE INDEX idx_article_blocks_article_id ON article_blocks(article_id);
CREATE INDEX idx_article_blocks_article_position ON article_blocks(article_id, position);

CREATE UNIQUE INDEX uq_article_primary_author
    ON article_authors(article_id)
    WHERE role = 'primary';

CREATE TABLE article_tags (
    article_id      INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    tag_id          INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('primary', 'secondary')),
    PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag_id ON article_tags(tag_id);

CREATE UNIQUE INDEX uq_article_primary_tag
    ON article_tags(article_id)
    WHERE role = 'primary';

CREATE OR REPLACE VIEW v_articles AS
SELECT
    a.id,
    a.title,
    a.slug,
    a.headline,
    a.created_at AS "createdAt",
    a.updated_at AS "updatedAt",
    a.published_at AS "publishedAt",
    NULL::BIGINT AS "archivedAt",

    c.id AS "categoryId",
    c.name AS "categoryName",
    c.slug AS "categorySlug",

    -- FEATURED IMAGE
    CASE
        WHEN fm.id IS NULL THEN NULL
        ELSE json_build_object(
                'id', fm.id,
                'url', fm.bucket || '/' || fm.object_key,
                'thumbnailUrl',
                CASE
                    WHEN fm.thumbnail_object_key IS NOT NULL
     THEN fm.thumbnail_bucket || '/' || fm.thumbnail_object_key
                    ELSE NULL
                    END,
                'altText', fm.alt_text,
                'photographer',
                json_build_object(
     'id', au.id,
     'name', au.name,
     'slug', au.slug
                )
             )
        END AS "featuredImage",

    -- TAGS
    COALESCE(
            (
                SELECT json_agg(
            json_build_object(
                    'id', t.id,
                    'name', t.name,
                    'slug', t.slug
            )
    )
                FROM article_tags at
            JOIN tags t ON t.id = at.tag_id
            WHERE at.article_id = a.id
        ),
        '[]'::json
    )::text AS tags,

    -- AUTHORS
    COALESCE(
            (
                SELECT json_agg(
            json_build_object(
                    'id', au.id,
                    'name', au.name,
                    'slug', au.slug
            )
    )
                FROM article_authors aa
      JOIN authors au ON au.id = aa.author_id
                WHERE aa.article_id = a.id
            ),
            '[]'::json
    )::text AS authors,

    -- BLOCKS
    COALESCE(
            (
                SELECT json_agg(
            json_build_object(
                    'id', ab.id,
                    'type', ab.type,
                    'content', ab.content,
                    'media',
                    CASE
                        WHEN m.id IS NULL THEN NULL
                        ELSE json_build_object(
             'id', m.id,
             'url', m.bucket || '/' || m.object_key,
             'thumbnailUrl',
             CASE
                 WHEN m.thumbnail_object_key IS NOT NULL
                     THEN m.thumbnail_bucket || '/' || m.thumbnail_object_key
                 ELSE NULL
                 END,
             'altText', m.alt_text,
             'photographer',
             json_build_object(
                     'id', pa.id,
                     'name', pa.name,
                     'slug', pa.slug
             )
          )
                        END
            )
                ORDER BY ab.position
    )
                FROM article_blocks ab
      LEFT JOIN media m ON m.id = ab.media_id
      LEFT JOIN authors pa ON pa.id = m.id -- ⚠
                WHERE ab.article_id = a.id
            ),
            '[]'::json
    )::text AS blocks

FROM articles a
         JOIN categories c ON c.id = a.category_id
         LEFT JOIN media fm ON fm.id = a.featured_media_id
         LEFT JOIN authors au ON au.id = (
    SELECT aa.author_id
    FROM article_authors aa
    WHERE aa.article_id = a.id AND aa.role = 'primary'
    LIMIT 1
    );