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

CREATE VIEW v_users AS
SELECT
    u.id,
    u.username,
    u.email,
    u.role,
    u.password_hash,
    u.first_name,
    u.last_name,
    u.bio,
    m.id AS avatar_media_id,
    m.bucket AS avatar_bucket,
    m.object_key AS avatar_object_key,
    u.active_account,
    u.created_at,
    u.updated_at
FROM users u
LEFT JOIN medias m
ON u.avatar_media_id = m.id;

CREATE OR REPLACE VIEW v_medias AS
SELECT
    m.id,
    m.purpose,
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
    m.bucket || '/' || m.object_key AS path,
    CASE
        WHEN m.thumbnail_object_key IS NOT NULL
            THEN m.thumbnail_bucket || '/' || m.thumbnail_object_key
        ELSE NULL
        END AS thumbnail_path,
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
    -----------------------------------------------------------------------
    -- CONTENT'S NOT NULLABLE FIELDS
    a.type,
    a.title,
    a.headline,
    a.state as content_state,
    -----------------------------------------------------------------------
    -- CONTENT'S NULLABLE FIELDS
    a.slug,
    a.archived_at as archived_at,
    a.published_at AS published_at,
    a.created_at AS created_at,
    a.updated_at AS updated_at,
    -----------------------------------------------------------------------
    -- CONTENT'S CATEGORY FIELDS
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    -----------------------------------------------------------------------
    -- CONTENT'S FEATURED MEDIA FIELDS
    CASE
        WHEN fm.id IS NULL THEN NULL
        ELSE json_build_object(
                'id', fm.id,
                'path', fm.path,
                'thumbnailPath', fm.thumbnail_path,
                'altText', fm.alt_text,
                'mimeType', fm.mime_type,
                'sizeBytes', fm.size_bytes,
                'credits', fm.credits
             )
        END AS featured_image,
    -----------------------------------------------------------------------
    -- CONTENT'S TAGS, AUTHORS AND BLOCKS FIELDS
    COALESCE(tags.items, '[]'::json)::text AS tags,
    COALESCE(authors.items, '[]'::json)::text AS authors,
    COALESCE(blocks.items, '[]'::json)::text AS blocks

FROM contents a
         LEFT JOIN categories c ON c.id = a.category_id
         LEFT JOIN v_medias fm ON fm.id = a.featured_media_id
         LEFT JOIN LATERAL (
    SELECT json_agg(
                   json_build_object(
                           'id', t.id,
                           'name', t.name,
                           'slug', t.slug
                   )
           ) AS items
    FROM content_tags ct JOIN tags t ON t.id = ct.tag_id
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
                                       'path', m.path,
                                       'thumbnailPath', m.thumbnail_path,
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

-- Published Content View
CREATE OR REPLACE VIEW v_published_contents AS
SELECT *
FROM v_contents
WHERE (content_state = 'PUBLISHED'::content_state OR content_state = 'PENDING_REVIEW'::content_state)
    AND slug IS NOT NULL
    AND category_id IS NOT NULL;

-- Content summary
CREATE OR REPLACE VIEW v_contents_summary AS
SELECT
    a.id,
    a.type,
    a.title,
    a.state AS content_state,
    a.slug,
    a.created_at,
    a.archived_at,
    a.published_at,
    c.id AS category_id,
    c.name AS category_name,
    CASE
        WHEN fm.id IS NULL THEN NULL
        ELSE fm.bucket || '/' || fm.object_key
        END AS "featuredImage",
    COALESCE(authors.items, '[]'::json)::text AS authors
FROM contents a
         LEFT JOIN categories c ON c.id = a.category_id
         LEFT JOIN medias fm ON fm.id = a.featured_media_id
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
        ) authors ON true;

-- Published Content summary
CREATE OR REPLACE VIEW v_published_contents_summary AS
SELECT *
FROM v_contents_summary
WHERE (content_state = 'PUBLISHED'::content_state OR content_state = 'PENDING_REVIEW'::content_state)
    AND slug IS NOT NULL
    AND category_id IS NOT NULL;
