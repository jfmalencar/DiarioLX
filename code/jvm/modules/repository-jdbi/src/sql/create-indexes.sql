CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_slug ON articles(slug);

CREATE INDEX idx_article_authors_article_id ON article_authors(article_id);
CREATE INDEX idx_article_authors_author_id ON article_authors(author_id);

CREATE INDEX idx_article_blocks_article_id ON article_blocks(article_id);
CREATE INDEX idx_article_blocks_article_position ON article_blocks(article_id, position);

CREATE INDEX idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag_id ON article_tags(tag_id);

CREATE UNIQUE INDEX uq_article_primary_author
    ON article_authors(article_id)
    WHERE role = 'primary';

CREATE UNIQUE INDEX uq_article_primary_tag
    ON article_tags(article_id)
    WHERE role = 'primary';