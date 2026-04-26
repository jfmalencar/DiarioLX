package pt.ipl.diariolx.repository

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import pt.ipl.diariolx.domain.article.Article
import pt.ipl.diariolx.domain.article.ArticleSummary
import pt.ipl.diariolx.domain.article.NewArticle
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.media.MediaSummary

class JdbiArticleRepository(
    private val handle: Handle,
) : ArticleRepository {
    override fun create(article: NewArticle): Int {
        val articleId =
            handle
                .createQuery(
                    """
                    insert into articles (title, headline, featured_media_id, slug, category_id)
                    values (:title, :headline,:featured_media_id, :slug, :category_id)
                    returning id
                    """.trimIndent(),
                ).bind("title", article.title)
                .bind("headline", article.headline)
                .bind("featured_media_id", article.featuredMediaId)
                .bind("slug", article.slug)
                .bind("category_id", article.categoryId)
                .mapTo<Int>()
                .one()

        insertAuthors(articleId, article)
        insertTags(articleId, article)
        insertBlocks(articleId, article)
        return articleId
    }

    override fun getById(id: Int): Article? {
        TODO("Not yet implemented")
    }

    override fun getBySlug(slug: String): Article? =
        handle
            .createQuery("select * from v_articles where slug = :slug")
            .bind("slug", slug)
            .mapTo<ArticleModel>()
            .singleOrNull()
            ?.article

    override fun getAll(
        page: Int,
        limit: Int,
        query: String?,
        archived: Boolean,
    ): List<ArticleSummary> {
        val sql =
            buildString {
                append("select * from v_articles_summary WHERE 1 = 1".trimIndent())
                if (query != null) {
                    append(" AND (title ILIKE :query OR slug ILIKE :query)")
                }
                append(" ORDER BY id desc")
                append(" LIMIT :limit OFFSET :offset")
            }
        return handle
            .createQuery(sql)
            .bind("limit", limit)
            .bind("offset", (page - 1) * limit)
            .bind("query", "%$query%")
            .mapTo<ArticleSummaryModel>()
            .list()
            .map { it.article }
    }

    override fun delete(id: Int): Boolean {
        TODO("Not yet implemented")
    }

    override fun archive(id: Int): Boolean {
        TODO("Not yet implemented")
    }

    override fun unarchive(id: Int): Boolean {
        TODO("Not yet implemented")
    }

    private fun insertAuthors(
        articleId: Int,
        article: NewArticle,
    ) {
        if (article.authors.isEmpty()) return
        val batch =
            handle.prepareBatch(
                """
                insert into article_authors (article_id, author_id, role)
                values (:article_id, :author_id, :role)
                """.trimIndent(),
            )

        article.authors.forEachIndexed { idx, author ->
            batch
                .bind("article_id", articleId)
                .bind("author_id", author.authorId)
                .bind("role", if (idx == 0) "primary" else "secondary")
                .add()
        }

        batch.execute()
    }

    private fun insertTags(
        articleId: Int,
        article: NewArticle,
    ) {
        if (article.tags.isEmpty()) return

        val batch =
            handle.prepareBatch(
                """
                insert into article_tags (article_id, tag_id, role)
                values (:article_id, :tag_id, :role)
                """.trimIndent(),
            )

        article.tags.forEachIndexed { idx, tag ->
            batch
                .bind("article_id", articleId)
                .bind("tag_id", tag.tagId)
                .bind("role", if (idx == 0) "primary" else "secondary")
                .add()
        }

        batch.execute()
    }

    private fun insertBlocks(
        articleId: Int,
        article: NewArticle,
    ) {
        if (article.blocks.isEmpty()) return

        val batch =
            handle.prepareBatch(
                """
                insert into article_blocks (article_id, type, content, media_id, position)
                values (:article_id, :type, :content, :media_id, :position)
                """.trimIndent(),
            )

        article.blocks.forEachIndexed { index, block ->
            batch
                .bind("article_id", articleId)
                .bind("type", block.type)
                .bind("content", block.content)
                .bind("media_id", block.mediaId)
                .bind("position", index)
                .add()
        }

        batch.execute()
    }

    private data class ArticleModel(
        val id: Int,
        val title: String,
        val slug: String,
        val headline: String,
        val categoryId: Int,
        val categoryName: String,
        val categorySlug: String,
        val featuredImage: String?,
        val tags: String,
        val authors: String,
        val blocks: String,
        val createdAt: Long,
        val updatedAt: Long,
        val publishedAt: Long?,
        val archivedAt: Long?,
    ) {
        private inline fun <reified T> parseJson(json: String): T {
            val objectMapper = ObjectMapper().registerKotlinModule()
            return objectMapper.readValue(json)
        }

        val article: Article
            get() =
                Article(
                    id = id,
                    title = title,
                    slug = slug,
                    headline = headline,
                    category =
                        CategorySummary(
                            id = categoryId,
                            name = categoryName,
                            slug = categorySlug,
                        ),
                    featuredImage = featuredImage?.let { parseJson<MediaSummary>(it) },
                    tags = parseJson(tags),
                    authors = parseJson(authors),
                    blocks = parseJson(blocks),
                    createdAt = Instant.fromEpochSeconds(createdAt),
                    updatedAt = Instant.fromEpochSeconds(updatedAt),
                    publishedAt = publishedAt?.let { Instant.fromEpochSeconds(it) },
                    archivedAt = archivedAt?.let { Instant.fromEpochSeconds(it) },
                )
    }

    private data class ArticleSummaryModel(
        val id: Int,
        val title: String,
        val slug: String,
        val categoryName: String,
        val featuredImage: String?,
        val authors: String,
        val createdAt: Long,
    ) {
        val article: ArticleSummary
            get() =
                ArticleSummary(
                    id = id,
                    title = title,
                    slug = slug,
                    category = categoryName,
                    featuredImage = featuredImage,
                    authors = authors.split(", "),
                    createdAt = Instant.fromEpochSeconds(createdAt).toString(),
                    isPublished = true,
                )
    }
}
