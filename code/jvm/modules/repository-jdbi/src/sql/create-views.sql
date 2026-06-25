-- Tags
CREATE VIEW v_tags AS
SELECT
    t.id,
    t.name,
    t.slug,
    t.description,
    (SELECT COUNT(*) FROM content_tags ct
     WHERE ct.tag_id = t.id) AS quantity,
    t.created_at,
    t.updated_at,
    t.archived_at
FROM tags t;

-- Categories
CREATE VIEW v_categories AS
SELECT
    c.id,
    c.name,
    c.slug,
    c.description,
    c.color,
    c.parent_id,
    p.name AS parentName,
    (SELECT COUNT(*) FROM contents a
        WHERE a.category_id = c.id
          AND a.state = 'PUBLISHED'
    ) AS quantity,
    c.created_at,
    c.updated_at,
    c.archived_at
FROM categories c
LEFT JOIN categories p ON p.id = c.parent_id;

-- Users
CREATE VIEW v_users AS
SELECT
    u.id,
    u.username,
    u.email,
    u.role,
    u.password_hash,
    u.first_name,
    u.last_name,
    u.position,
    u.bio,
    u.on_team,
    m.id         AS avatar_media_id,
    m.bucket     AS avatar_bucket,
    m.object_key AS avatar_object_key,
    u.active_account,
    u.created_at,
    u.updated_at
FROM users u
LEFT JOIN medias m ON m.id = u.avatar_media_id;

-- Medias
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
                'id',   u.id,
                'name', u.first_name || ' ' || u.last_name,
                'slug', u.username,
                'role', mc.role
            ) ORDER BY u.first_name, u.last_name
        ) FILTER (WHERE u.id IS NOT NULL),
        '[]'::json
    ) AS credits
FROM medias m
LEFT JOIN media_credits mc ON mc.media_id = m.id
LEFT JOIN users u          ON u.id = mc.user_id
GROUP BY m.id;

-- -----------------------------------------------------------------------
-- Contents (full)
-- -----------------------------------------------------------------------
CREATE OR REPLACE VIEW v_contents AS
SELECT
    a.id,
    -- not nullable
    a.type,
    a.title,
    a.headline,
    a.state       AS content_state,
    -- nullable
    a.slug,
    a.archived_at,
    a.published_at,
    a.created_at,
    a.updated_at,
    -- parent (Episode -> Podcast)
    a.parent_id,
    CASE
        WHEN p.id IS NULL THEN NULL
        ELSE json_build_object('id', p.id, 'title', p.title, 'slug', p.slug, 'image', pm.path)
    END AS parent,
    -- external embed (YouTube/Spotify)
    a.embed_url,
    -- category (Episodes inherit their parent Podcast's category)
    c.id          AS category_id,
    c.name        AS category_name,
    c.slug        AS category_slug,
    c.color       AS category_color,
    -- featured image
    CASE
        WHEN fm.id IS NULL THEN NULL
        ELSE json_build_object(
            'id',            fm.id,
            'path',          fm.path,
            'thumbnailPath', fm.thumbnail_path,
            'altText',       fm.alt_text,
            'mimeType',      fm.mime_type,
            'sizeBytes',     fm.size_bytes,
            'credits',       fm.credits
        )
    END AS featured_image,
    -- aggregates
    COALESCE(tags.items,    '[]'::json)::text AS tags,
    COALESCE(authors.items, '[]'::json)::text AS authors,
    COALESCE(blocks.items,  '[]'::json)::text AS blocks
FROM contents a
LEFT JOIN contents   p  ON p.id  = a.parent_id
LEFT JOIN v_medias   pm ON pm.id = p.featured_media_id
LEFT JOIN categories c  ON c.id  = COALESCE(a.category_id, p.category_id)
LEFT JOIN v_medias   fm ON fm.id = a.featured_media_id
LEFT JOIN LATERAL (
    SELECT json_agg(
        json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
    ) AS items
    FROM content_tags ct
    JOIN tags t ON t.id = ct.tag_id
    WHERE ct.content_id = a.id
) tags ON true
LEFT JOIN LATERAL (
    SELECT json_agg(
        json_build_object(
            'id',   u.id,
            'name', u.first_name || ' ' || u.last_name,
            'slug', u.username
        ) ORDER BY (ca.role = 'primary') DESC
    ) AS items
    FROM content_authors ca
    JOIN users u ON u.id = ca.author_id
    WHERE ca.content_id = a.id
) authors ON true
LEFT JOIN LATERAL (
    SELECT json_agg(
        json_build_object(
            'id',      cb.id,
            'type',    cb.type,
            'content', cb.content,
            'media',   CASE
                           WHEN m.id IS NULL THEN NULL
                           ELSE json_build_object(
                               'id',            m.id,
                               'path',          m.path,
                               'thumbnailPath', m.thumbnail_path,
                               'altText',       m.alt_text,
                               'mimeType',      m.mime_type,
                               'sizeBytes',     m.size_bytes,
                               'credits',       m.credits
                           )
                       END,
            'images',  COALESCE(gallery.items, '[]'::json)
        ) ORDER BY cb.position
    ) AS items
    FROM content_blocks cb
    LEFT JOIN v_medias m ON m.id = cb.media_id
    LEFT JOIN LATERAL (
        SELECT json_agg(
            json_build_object(
                'caption', cbi.caption,
                'media',   json_build_object(
                    'id',            gm.id,
                    'path',          gm.path,
                    'thumbnailPath', gm.thumbnail_path,
                    'altText',       gm.alt_text,
                    'mimeType',      gm.mime_type,
                    'sizeBytes',     gm.size_bytes,
                    'credits',       gm.credits
                )
            ) ORDER BY cbi.position
        ) AS items
        FROM content_block_images cbi
        JOIN v_medias gm ON gm.id = cbi.media_id
        WHERE cbi.block_id = cb.id
    ) gallery ON true
    WHERE cb.content_id = a.id
) blocks ON true;

-- Contents (published)
CREATE OR REPLACE VIEW v_published_contents AS
SELECT * FROM v_contents
WHERE content_state IN ('PUBLISHED'::content_state, 'PENDING_REVIEW'::content_state)
  AND slug IS NOT NULL
  AND category_id IS NOT NULL;

-- -----------------------------------------------------------------------
-- Contents summary (full)
-- -----------------------------------------------------------------------
CREATE OR REPLACE VIEW v_contents_summary AS
SELECT
    a.id,
    a.type,
    a.title,
    a.headline,
    a.state       AS content_state,
    a.slug,
    a.created_at,
    a.archived_at,
    a.published_at,
    a.parent_id,
    a.embed_url,
    c.id          AS category_id,
    c.name        AS category_name,
    c.slug        AS category_slug,
    c.color       AS category_color,
    -- An episode's own featured media is its audio (not an image), so episodes
    -- always use the parent podcast's image for cards.
    CASE
        WHEN a.type = 'EPISODE'
            THEN (CASE WHEN pm.id IS NULL THEN NULL ELSE pm.bucket || '/' || pm.object_key END)
        WHEN fm.id IS NULL THEN NULL
        ELSE fm.bucket || '/' || fm.object_key
    END AS "featuredImage",
    COALESCE(authors.items, '[]'::json)::text AS authors,
    primary_tag.id    AS tag_id,
    primary_tag.name  AS tag_name,
    primary_tag.slug  AS tag_slug
FROM contents a
         LEFT JOIN contents   p  ON p.id  = a.parent_id
         LEFT JOIN medias     pm ON pm.id = p.featured_media_id
         LEFT JOIN categories c  ON c.id  = COALESCE(a.category_id, p.category_id)
         LEFT JOIN medias     fm ON fm.id = a.featured_media_id
         LEFT JOIN LATERAL (
    SELECT json_agg(
                   json_build_object(
                           'id',   u.id,
                           'name', u.first_name || ' ' || u.last_name,
                           'slug', u.username
                   ) ORDER BY (ca.role = 'primary') DESC
           ) AS items
    FROM content_authors ca
             JOIN users u ON u.id = ca.author_id
    WHERE ca.content_id = a.id
        ) authors ON true
         LEFT JOIN LATERAL (
    SELECT t.id, t.name, t.slug
    FROM content_tags ct
             JOIN tags t ON t.id = ct.tag_id
    WHERE ct.content_id = a.id
      AND ct.role = 'primary'
        LIMIT 1
) primary_tag ON true;


-- Contents summary (published)
CREATE OR REPLACE VIEW v_published_contents_summary AS
SELECT * FROM v_contents_summary
WHERE content_state IN ('PUBLISHED'::content_state, 'PENDING_REVIEW'::content_state)
  AND slug IS NOT NULL
  AND category_id IS NOT NULL;

-- -----------------------------------------------------------------------
-- Contents history
-- -----------------------------------------------------------------------
CREATE OR REPLACE VIEW v_content_review_history AS
SELECT
    ch.content_id AS content_id,
    COALESCE(u.first_name || ' ' || u.last_name) AS reviewer_name,
    ch.action     AS action_performed,
    ch.comment    AS review_comment,
    ch.performed_at
FROM content_history ch
         LEFT JOIN users u ON u.id = ch.performed_by;

-- Featured sections
CREATE VIEW v_featured_sections AS
SELECT
    fs.id          AS section_id,
    fs.type        AS section_type,
    fs.category_id AS section_category_id,
    sc.name        AS section_category_name,
    sc.slug        AS section_category_slug,
    sc.color       AS section_category_color,
    fs.position    AS section_position,
    fc.position    AS content_position,
    cs.*
FROM featured_sections fs
         LEFT JOIN categories sc ON sc.id = fs.category_id
         LEFT JOIN featured_contents fc ON fc.section_id = fs.id
         LEFT JOIN v_contents_summary cs ON cs.id = fc.content_id
ORDER BY fs.position, fc.position;
