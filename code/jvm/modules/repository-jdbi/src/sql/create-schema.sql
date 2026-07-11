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
CREATE TYPE content_type AS ENUM ('ARTICLE', 'VIDEO', 'EPISODE', 'PODCAST', 'PHOTO_ESSAY');
CREATE TYPE content_state AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE media_purpose AS ENUM ('GALLERY', 'PROFILE');
CREATE TYPE block_type AS ENUM ('TEXT', 'QUOTE', 'MEDIA', 'H3', 'H4', 'GALLERY', 'EMBED');
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
    position TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    on_team BOOLEAN DEFAULT FALSE,
    avatar_media_id INTEGER NULL REFERENCES medias(id),
    active_account BOOLEAN DEFAULT TRUE,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE TYPE reset_request_status AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'REJECTED');

CREATE TABLE password_reset_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status reset_request_status NOT NULL DEFAULT 'PENDING',
    admin_id INTEGER NULL REFERENCES users(id) ON DELETE SET NULL,
    reset_token VARCHAR (64) UNIQUE NULL,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
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
     user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    -- Episodes belong to a Podcast (self-reference); deleting the podcast removes its episodes.
    parent_id         INTEGER NULL REFERENCES contents(id) ON DELETE CASCADE DEFAULT NULL,
    -- External embed for VIDEO (YouTube) / EPISODE (Spotify) instead of an uploaded file.
    embed_url         TEXT NULL DEFAULT NULL,
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
        (type IN ('TEXT', 'QUOTE', 'H3', 'H4', 'EMBED') AND content IS NOT NULL)
            OR
        (type = 'MEDIA' AND media_id IS NOT NULL)
            OR
        (type = 'GALLERY' AND media_id IS NULL AND content IS NULL)
    )
);

CREATE TABLE content_block_images (
    block_id        INTEGER NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,
    media_id        INTEGER NOT NULL REFERENCES medias(id),
    caption         TEXT NULL,
    position        INTEGER NOT NULL,

    PRIMARY KEY (block_id, position)
);

CREATE TABLE content_tags (
    content_id      INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    tag_id          INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('primary', 'secondary')),
    PRIMARY KEY (content_id, tag_id)
);

CREATE TABLE featured_sections (
    id          SERIAL PRIMARY KEY,
    type        VARCHAR(30) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    position    INTEGER NOT NULL,
    CONSTRAINT uq_section_position UNIQUE (position),
    CONSTRAINT chk_type_category CHECK (
        (type = 'CATEGORY' AND category_id IS NOT NULL) OR
        (type <> 'CATEGORY' AND category_id IS NULL)
    )
);

CREATE TABLE featured_contents (
    id          SERIAL PRIMARY KEY,
    section_id  INTEGER  NOT NULL REFERENCES featured_sections(id) ON DELETE CASCADE,
    content_id  INTEGER  NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
    position    INTEGER  NOT NULL,
    CONSTRAINT uq_section_position_content UNIQUE (section_id, position)
);

-- Generic key/value site settings (social links, contact info, navigation config)
CREATE TABLE settings (
    key   VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL
);


