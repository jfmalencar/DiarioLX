CREATE INDEX idx_content_category_id ON contents(category_id);

CREATE INDEX idx_content_authors_content_id ON content_authors(content_id);
CREATE INDEX idx_content_authors_author_id ON content_authors(author_id);

CREATE INDEX idx_content_blocks_content_position ON content_blocks(content_id, position);

CREATE INDEX idx_content_tags_content_id ON content_tags(content_id);
CREATE INDEX idx_content_tags_tag_id ON content_tags(tag_id);

CREATE UNIQUE INDEX uq_content_primary_author
    ON content_authors(content_id)
    WHERE role = 'primary';

CREATE UNIQUE INDEX uq_content_primary_tag
    ON content_tags(content_id)
    WHERE role = 'primary';

CREATE INDEX idx_contents_section  ON featured_contents (section_id, position);