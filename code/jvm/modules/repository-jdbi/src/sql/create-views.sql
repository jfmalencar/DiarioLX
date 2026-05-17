CREATE VIEW v_tags AS
SELECT
    t.id,
    t.name,
    t.slug,
    t.description,
    (
    SELECT COUNT(*)
     FROM content_tags
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
        FROM contents a
        WHERE a.category_id = c.id
    ) AS quantity,
    c.created_at,
    c.updated_at,
    c.archived_at
FROM categories c
LEFT JOIN categories p
ON p.id = c.parent_id;

CREATE OR REPLACE VIEW v_medias AS
SELECT
    m.id,
    m.type,
    m.bucket,
    m.object_key,
    m.thumbnail_bucket,
    m.thumbnail_object_key,
    m.original_file_name,
    m.alt_text,
    m.mime_type,
    m.status,
    m.size_bytes,
    m.created_at,
    m.uploaded_at,

    m.bucket || '/' || m.object_key AS url,

    CASE
        WHEN m.thumbnail_object_key IS NOT NULL
            THEN m.thumbnail_bucket || '/' || m.thumbnail_object_key
        ELSE NULL
        END AS thumbnail_url,

    COALESCE(
            json_agg(
                    json_build_object(
                            'id', u.id,
                            'name', u.first_name || ' ' || u.last_name,
                            'slug', u.username,
                            'role', mc.role
                    )
                        ORDER BY u.first_name, u.last_name
            ) FILTER (WHERE u.id IS NOT NULL),
            '[]'::json
    ) AS credits

FROM medias m
         LEFT JOIN media_credits mc ON mc.media_id = m.id
         LEFT JOIN users u ON u.id = mc.user_id

GROUP BY m.id;

-- Content
CREATE OR REPLACE VIEW v_contents AS
SELECT
    a.id,
    a.title,
    a.slug,
    a.headline,
    a.type,
    a.created_at AS "createdAt",
    a.updated_at AS "updatedAt",
    a.published_at AS "publishedAt",
    NULL::BIGINT AS "archivedAt",

    c.id AS "categoryId",
    c.name AS "categoryName",
    c.slug AS "categorySlug",

    CASE
        WHEN fm.id IS NULL THEN NULL
        ELSE json_build_object(
                'id', fm.id,
                'type', fm.type,
                'url', fm.url,
                'thumbnailUrl', fm.thumbnail_url,
                'altText', fm.alt_text,
                'mimeType', fm.mime_type,
                'sizeBytes', fm.size_bytes,
                'credits', fm.credits
             )
        END AS "featuredImage",

    COALESCE(tags.items, '[]'::json)::text AS tags,
    COALESCE(authors.items, '[]'::json)::text AS authors,
    COALESCE(blocks.items, '[]'::json)::text AS blocks

FROM contents a

         JOIN categories c
              ON c.id = a.category_id

         LEFT JOIN v_medias fm
                   ON fm.id = a.featured_media_id

         LEFT JOIN LATERAL (
    SELECT json_agg(
                   json_build_object(
                           'id', t.id,
                           'name', t.name,
                           'slug', t.slug
                   )
           ) AS items
    FROM content_tags ct
             JOIN tags t ON t.id = ct.tag_id
    WHERE ct.content_id = a.id
        ) tags ON true

         LEFT JOIN LATERAL (
    SELECT json_agg(
                   json_build_object(
                           'id', u.id,
                           'name', u.first_name || ' ' || u.last_name,
                           'slug', u.username
                   )
                       ORDER BY (ca.role = 'primary') DESC
           ) AS items
    FROM content_authors ca
             JOIN users u ON u.id = ca.author_id
    WHERE ca.content_id = a.id
        ) authors ON true

         LEFT JOIN LATERAL (
    SELECT json_agg(
                   json_build_object(
                           'id', cb.id,
                           'type', cb.type,
                           'content', cb.content,
                           'media',
                           CASE
                               WHEN m.id IS NULL THEN NULL
                               ELSE json_build_object(
                                       'id', m.id,
                                       'type', m.type,
                                       'url', m.url,
                                       'thumbnailUrl', m.thumbnail_url,
                                       'altText', m.alt_text,
                                       'mimeType', m.mime_type,
                                       'sizeBytes', m.size_bytes,
                                       'credits', m.credits
                                    )
                               END
                   )
                       ORDER BY cb.position
           ) AS items
    FROM content_blocks cb
             LEFT JOIN v_medias m ON m.id = cb.media_id
    WHERE cb.content_id = a.id
        ) blocks ON true;

-- Content summary
CREATE OR REPLACE VIEW v_contents_summary AS
SELECT
    a.id,
    a.title,
    a.slug,
    a.type,
    c.name AS "categoryName",
    fm.bucket || '/' || fm.object_key AS "featuredImage",
    COALESCE(authors.names, '') AS authors,
    a.created_at AS "createdAt"
FROM contents a
         JOIN categories c ON c.id = a.category_id
         LEFT JOIN medias fm ON fm.id = a.featured_media_id
         LEFT JOIN LATERAL (
    SELECT string_agg(concat_ws(' ', u.first_name, u.last_name), ', ' ORDER BY u.first_name) AS names
FROM content_authors aa
    JOIN users u ON u.id = aa.author_id
WHERE aa.content_id = a.id) authors ON true;
