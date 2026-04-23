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

DROP TABLE IF EXISTS profiles CASCADE;
--DROP TABLE IF EXISTS pictures CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS invites CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

CREATE TYPE user_role AS ENUM ('ADMIN', 'EDITOR', 'CONTRIBUTOR');

CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     username VARCHAR(30) NOT NULL UNIQUE ,
                                     email VARCHAR(30) NOT NULL UNIQUE,
                                     role user_role NOT NULL,
                                     password_hash VARCHAR(255) NOT NULL,
                                     first_name VARCHAR(30) NOT NULL,
                                     last_name VARCHAR(30) NOT NULL,
                                     bio TEXT DEFAULT '',
                                     profile_picture_url VARCHAR(255) DEFAULT '',
                                     active_account BOOLEAN DEFAULT TRUE,
                                     created_at BIGINT NOT NULL ,
                                     updated_at BIGINT NOT NULL
);

--CREATE TABLE IF NOT EXISTS pictures (
--    id SERIAL PRIMARY KEY,
--    created_by_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
--    url VARCHAR(255) NOT NULL UNIQUE,
--    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--);

CREATE TABLE invites (
                         id SERIAL PRIMARY KEY,
                         invite_token VARCHAR(64) UNIQUE NOT NULL,
                         role_assigned user_role NOT NULL,
                         created_at BIGINT NOT NULL,
                         expires_at BIGINT NOT NULL,
                         used BOOLEAN DEFAULT FALSE
);

INSERT INTO invites (invite_token, role_assigned, created_at, expires_at) VALUES
    ('SUPER-ADMIN-INVITE', 'ADMIN', extract(epoch from now())::bigint, extract(epoch from now() + interval '20 minutes')::bigint);

CREATE TABLE sessions (
                          session_token VARCHAR(256) PRIMARY KEY ,
                          user_id INT REFERENCES users (id),
                          created_at BIGINT NOT NULL,
                          last_used_at BIGINT NOT NULL
);