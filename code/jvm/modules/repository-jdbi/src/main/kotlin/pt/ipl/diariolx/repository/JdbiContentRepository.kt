package pt.ipl.diariolx.repository

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.content.NewContent
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.domain.tag.TagSummary
import java.time.LocalDate

class JdbiContentRepository(
    private val handle: Handle,
) : ContentRepository {
    override fun create(content: NewContent): Int {
        val contentId =
            handle
                .createQuery(
                    """
                    insert into contents (type, title, headline, featured_media_id, slug, category_id)
                    values (:type::content_type, :title, :headline,:featured_media_id, :slug, :category_id)
                    returning id
                    """.trimIndent(),
                ).bind("type", content.type)
                .bind("title", content.title)
                .bind("headline", content.headline)
                .bind("featured_media_id", content.featuredMediaId)
                .bind("slug", content.slug)
                .bind("category_id", content.categoryId)
                .mapTo<Int>()
                .one()

        insertAuthors(contentId, content)
        insertTags(contentId, content)
        insertBlocks(contentId, content)
        return contentId
    }

    override fun getById(id: Int): Content? {
        TODO("Not yet implemented")
    }

    override fun getBySlug(slug: String): Content? =
        handle
            .createQuery("select * from v_contents where slug = :slug")
            .bind("slug", slug)
            .mapTo<ContentModel>()
            .singleOrNull()
            ?.content

    override fun getAll(
        limit: Int,
        offset: Int,
        type: ContentType?,
        query: String?,
        archived: Boolean,
        onlyPublished: Boolean,
        tag: String?,
        category: String?,
        from: LocalDate?,
        to: LocalDate?,
    ): List<ContentSummary> {
        val sql =
            buildString {
                append("select * from v_contents_summary WHERE 1 = 1".trimIndent())
                if (query != null) {
                    append(" AND (title ILIKE :query OR slug ILIKE :query)")
                }
                if (type != null) {
                    append(" AND type = :type")
                }
                if (archived) {
                    append(" AND archived_at IS NOT NULL")
                } else {
                    append(" AND archived_at IS NULL")
                }
                if (tag != null) {
                    append(" AND tag_slug = :tag")
                }
                if (category != null) {
                    append(" AND category_slug = :category")
                }
                if (onlyPublished) {
                    append(" AND published_at IS NOT NULL AND published_at <= EXTRACT(EPOCH FROM NOW())")
                }
                if (from != null) {
                    append(" AND published_at >= :from")
                }
                if (to != null) {
                    append(" AND published_at <= :to")
                }
                append(" ORDER BY id desc")
                append(" LIMIT :limit OFFSET :offset")
            }
        return handle
            .createQuery(sql)
            .bind("limit", limit)
            .bind("offset", offset)
            .bind("query", "%$query%")
            .bind("type", type)
            .bind("category", category)
            .bind("tag", tag)
            .bind("from", from?.toEpochDay())
            .bind("to", to?.toEpochDay())
            .mapTo<ContentSummaryModel>()
            .list()
            .map { it.content }
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
        contentId: Int,
        content: NewContent,
    ) {
        if (content.authors.isEmpty()) return
        val batch =
            handle.prepareBatch(
                """
                insert into content_authors (content_id, author_id, role)
                values (:content_id, :author_id, :role)
                """.trimIndent(),
            )

        content.authors.forEachIndexed { idx, author ->
            batch
                .bind("content_id", contentId)
                .bind("author_id", author.authorId)
                .bind("role", if (idx == 0) "primary" else "secondary")
                .add()
        }

        batch.execute()
    }

    private fun insertTags(
        contentId: Int,
        content: NewContent,
    ) {
        if (content.tags.isEmpty()) return

        val batch =
            handle.prepareBatch(
                """
                insert into content_tags (content_id, tag_id, role)
                values (:content_id, :tag_id, :role)
                """.trimIndent(),
            )

        content.tags.forEachIndexed { idx, tag ->
            batch
                .bind("content_id", contentId)
                .bind("tag_id", tag.tagId)
                .bind("role", if (idx == 0) "primary" else "secondary")
                .add()
        }

        batch.execute()
    }

    private fun insertBlocks(
        contentId: Int,
        content: NewContent,
    ) {
        if (content.blocks.isEmpty()) return

        val batch =
            handle.prepareBatch(
                """
                insert into content_blocks (content_id, type, content, media_id, position)
                values (:content_id, :type, :content, :media_id, :position)
                """.trimIndent(),
            )

        content.blocks.forEachIndexed { index, block ->
            batch
                .bind("content_id", contentId)
                .bind("type", block.type)
                .bind("content", block.content)
                .bind("media_id", block.mediaId)
                .bind("position", index)
                .add()
        }

        batch.execute()
    }

    private data class ContentModel(
        val id: Int,
        val title: String,
        val slug: String,
        val type: String,
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

        val content: Content
            get() =
                Content(
                    id = id,
                    title = title,
                    slug = slug,
                    type = type,
                    headline = headline,
                    category =
                        CategorySummary(
                            id = categoryId,
                            name = categoryName,
                            slug = Slug(categorySlug),
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

    private data class ContentSummaryModel(
        val id: Int,
        val title: String,
        val slug: String,
        val categoryId: Int,
        val categorySlug: String,
        val categoryName: String,
        val tagId: Int,
        val tagName: String,
        val tagSlug: String,
        val featuredImage: String?,
        val authors: String,
        val createdAt: Long,
    ) {
        val content: ContentSummary
            get() =
                ContentSummary(
                    id = id,
                    title = title,
                    slug = slug,
                    category = CategorySummary(categoryId, categoryName, Slug(categorySlug)),
                    tag = TagSummary(tagId, tagName, tagSlug),
                    featuredImage = featuredImage,
                    authors = authors.split(", "),
                    createdAt = Instant.fromEpochSeconds(createdAt).toString(),
                    isPublished = true,
                )
    }
}
