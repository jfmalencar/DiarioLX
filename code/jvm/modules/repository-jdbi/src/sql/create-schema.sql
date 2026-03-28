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
