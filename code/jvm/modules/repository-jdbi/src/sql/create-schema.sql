DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS invites CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS contents CASCADE;
DROP TABLE IF EXISTS content_authors CASCADE;
DROP TABLE IF EXISTS content_blocks CASCADE;
DROP TABLE IF EXISTS content_tags CASCADE;
DROP TABLE IF EXISTS medias CASCADE;
DROP TABLE IF EXISTS media_credits CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS credit_role CASCADE;
DROP TYPE IF EXISTS content_type CASCADE;

CREATE TYPE user_role AS ENUM ('ADMIN', 'EDITOR', 'CONTRIBUTOR');
CREATE TYPE content_type AS ENUM ('ARTICLE', 'VIDEO', 'EPISODE', 'PODCAST');
CREATE TYPE content_state AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED');
CREATE TYPE media_purpose AS ENUM ('GALLERY', 'PROFILE');
CREATE TYPE block_type AS ENUM ('TEXT', 'QUOTE', 'IMAGE', 'H3', 'H4');
CREATE TYPE credit_role AS ENUM (
    'PHOTOGRAPHER',
    'VIDEOGRAPHER',
    'AUDIO_ENGINEER',
    'WRITER',
    'DIRECTOR',
    'PRODUCER',
    'EDITOR',
    'NARRATOR',
    'ACTOR',
    'MODEL',
    'ILLUSTRATOR',
    'DESIGNER',
    'OTHER'
);

CREATE TABLE medias (
    id                    SERIAL PRIMARY KEY,
    purpose               media_purpose NOT NULL,
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

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE ,
    email VARCHAR(30) NOT NULL UNIQUE,
    role user_role NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    bio TEXT DEFAULT '',
    avatar_media_id INTEGER NULL REFERENCES medias(id),
    active_account BOOLEAN DEFAULT TRUE,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

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

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    description TEXT,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    archived_at BIGINT DEFAULT NULL
);

CREATE TABLE invites (
    id SERIAL PRIMARY KEY,
    invite_token VARCHAR(64) UNIQUE NOT NULL,
    role_assigned user_role NOT NULL,
    created_at BIGINT NOT NULL,
    expires_at BIGINT NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

INSERT INTO invites (invite_token, role_assigned, created_at, expires_at) VALUES
    ('SUPER-ADMIN-INVITE', 'ADMIN', extract(epoch from now())::bigint, extract(epoch from now() + interval '60 minutes')::bigint);

CREATE TABLE sessions (
     id            SERIAL PRIMARY KEY,
     user_id       INT NOT NULL REFERENCES users(id),
     refresh_token VARCHAR(64) NOT NULL UNIQUE,
     created_at    BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
     expires_at    BIGINT NOT NULL
);

CREATE TABLE media_credits (
    media_id    INTEGER NOT NULL REFERENCES medias(id) ON DELETE CASCADE,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    role        credit_role NOT NULL,
    PRIMARY KEY (media_id, user_id, role)
);

CREATE TABLE contents (
    id                SERIAL PRIMARY KEY,
    -----------------------------------------------------------------------
    -- NOT NULLABLE FIELDS FOR ANY CONTENT TYPE
    type              content_type NOT NULL DEFAULT 'ARTICLE',
    title             VARCHAR(255) NOT NULL DEFAULT '',
    headline          TEXT NOT NULL DEFAULT '',
    -----------------------------------------------------------------------
    -- NULLABLE FIELDS FOR ANY CONTENT ON UPDATE
    featured_media_id INTEGER NULL REFERENCES medias(id) DEFAULT NULL,
    slug              VARCHAR(255) NULL UNIQUE DEFAULT NULL,
    category_id       INTEGER NULL REFERENCES categories(id) DEFAULT NULL,
    published_at      BIGINT DEFAULT NULL,
    archived_at       BIGINT DEFAULT NULL,
    -----------------------------------------------------------------------
    created_at        BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at        BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    state             content_state NOT NULL DEFAULT 'DRAFT'
);

CREATE TYPE content_history_action AS ENUM ('APPROVED', 'REJECTED');

CREATE TABLE content_history (
    id              SERIAL PRIMARY KEY,
    content_id      INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    performed_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action          content_history_action NOT NULL,
    comment         TEXT,
    performed_at    BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

CREATE TABLE content_authors (
    content_id      INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    author_id       INTEGER NOT NULL REFERENCES users(id),
    role            VARCHAR(20) NOT NULL CHECK (role IN ('primary', 'secondary')),
    PRIMARY KEY (content_id, author_id)
);

CREATE TABLE content_blocks (
    id              SERIAL PRIMARY KEY,
    content_id      INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    type            block_type NOT NULL,
    content         TEXT NULL,
    media_id        INTEGER NULL REFERENCES medias(id),
    position        INTEGER NOT NULL,

    created_at      BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at      BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),

    CONSTRAINT uq_content_blocks_content_position UNIQUE (content_id, position),
    CONSTRAINT chk_content_blocks_content CHECK (
        (type IN ('TEXT', 'QUOTE', 'H3', 'H4') AND content IS NOT NULL)
            OR
        (type = 'IMAGE' AND media_id IS NOT NULL)
    )
);

CREATE TABLE content_tags (
    content_id      INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    tag_id          INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('primary', 'secondary')),
    PRIMARY KEY (content_id, tag_id)
);

CREATE TABLE featured_contents (
    key         VARCHAR(50) PRIMARY KEY,
    content_id  INTEGER REFERENCES contents(id) ON DELETE SET NULL,
    position    INT NOT NULL DEFAULT 0,
    description VARCHAR(100),
    created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);
