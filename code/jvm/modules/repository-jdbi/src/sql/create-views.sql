CREATE VIEW v_tags AS
SELECT
    t.id,
    t.name,
    t.slug,
    t.description,
    (
    SELECT COUNT(*)
     FROM article_tags
        at
        WHERE at.tag_id = t.id
    ) AS quantity,
    t.created_at,
    t.updated_at,
    t.archived_at
FROM tags t;

CREATE VIEW v_categories AS
SELECT
    c.id,
    c.name,
    c.slug,
    c.description,
    c.color,
    c.parent_id,
    p.name AS parentName,
    (
        SELECT COUNT(*)
        FROM articles a
        WHERE a.category_id = c.id
    ) AS quantity,
    c.created_at,
    c.updated_at,
    c.archived_at
FROM categories c
LEFT JOIN categories p
ON p.id = c.parent_id;

-- Articles
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
                        'id', mu.id,
                        'name', mu.first_name || ' ' || mu.last_name,
                        'slug', mu.username
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
                                       'name', au.first_name || ' ' || au.last_name,
                                       'slug', au.username
                               )
                                   ORDER BY (aa.role = 'primary') DESC
                       )
                FROM article_authors aa
                         JOIN users au ON au.id = aa.author_id
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
                                                           'name', pa.first_name || ' ' || pa.last_name,
                                                           'slug', pa.username
                                                   )
                                                )
                                           END
                               )
                                   ORDER BY ab.position
                       )
                FROM article_blocks ab
                         LEFT JOIN media m ON m.id = ab.media_id
                         LEFT JOIN users pa ON pa.id = m.contributor_id
                WHERE ab.article_id = a.id
            ),
            '[]'::json
    )::text AS blocks

FROM articles a
         JOIN categories c ON c.id = a.category_id
         LEFT JOIN media fm ON fm.id = a.featured_media_id
         LEFT JOIN users mu ON mu.id = fm.contributor_id;

-- Articles summary
CREATE OR REPLACE VIEW v_articles_summary AS
SELECT
    a.id,
    a.title,
    a.slug,
    c.name AS "categoryName",
    fm.bucket || '/' || fm.object_key AS "featuredImage",
    COALESCE(authors.names, '') AS authors,
    a.created_at AS "createdAt"
FROM articles a
         JOIN categories c ON c.id = a.category_id
         LEFT JOIN media fm ON fm.id = a.featured_media_id
         LEFT JOIN LATERAL (
    SELECT string_agg(concat_ws(' ', u.first_name, u.last_name), ', ' ORDER BY u.first_name) AS names
FROM article_authors aa
    JOIN users u ON u.id = aa.author_id
WHERE aa.article_id = a.id) authors ON true;