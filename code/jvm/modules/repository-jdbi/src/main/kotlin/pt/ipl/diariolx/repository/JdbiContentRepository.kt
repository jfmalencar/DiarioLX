package pt.ipl.diariolx.repository

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.content.UpdateContent
import pt.ipl.diariolx.domain.content.value.ContentAuthor
import pt.ipl.diariolx.domain.content.value.ContentTag
import pt.ipl.diariolx.domain.content.value.NewContentBlock
import pt.ipl.diariolx.domain.media.MediaSummary

class JdbiContentRepository(
    private val handle: Handle,
) : ContentRepository {
    override fun createEmpty(
        type: ContentType,
        now: Instant,
    ): Int =
        handle
            .createUpdate(
                """
                INSERT INTO contents (type, created_at, updated_at)
                VALUES (:type::content_type, :created_at, :updated_at)
                RETURNING id
                """,
            ).bind("type", type.name)
            .bind("created_at", now.epochSeconds)
            .bind("updated_at", now.epochSeconds)
            .executeAndReturnGeneratedKeys()
            .mapTo(Int::class.java)
            .one()

    override fun updateContent(
        content: UpdateContent,
        now: Instant,
    ) {
        val contentId = content.id
        handle
            .createUpdate(
                """
                UPDATE contents 
                SET title = :title, headline = :headline, featured_media_id = :featured_media_id,
                    slug = :slug, category_id = :category_id, updated_at = :updated_at,
                    published_at = NULL, state = 'DRAFT'::content_state
                WHERE id = :id
                """,
            ).bind("title", content.title)
            .bind("headline", content.headline)
            .bind("featured_media_id", content.featuredMediaId)
            .bind("slug", content.slug)
            .bind("category_id", content.categoryId)
            .bind("updated_at", now.epochSeconds)
            .bind("id", contentId)
            .execute()

        updateAuthors(contentId, content.authors)
        updateTags(contentId, content.tags)
        updateBlocks(contentId, content.blocks)
    }

    override fun getById(id: Int): Content? =
        handle
            .createQuery("select * from v_published_contents where id = :id")
            .bind("id", id)
            .mapTo<PublicContentModel>()
            .singleOrNull()
            ?.content

    override fun getBySlug(slug: String): Content? =
        handle
            .createQuery("select * from v_published_contents where slug = :slug")
            .bind("slug", slug)
            .mapTo<PublicContentModel>()
            .singleOrNull()
            ?.content

    override fun getAll(
        limit: Int,
        offset: Int,
        query: String?,
        archived: Boolean,
    ): List<ContentSummary> {
        val sql =
            buildString {
                append("select * from v_published_contents_summary WHERE 1 = 1".trimIndent())
                if (archived) {
                    append(" AND archived_at IS NOT NULL")
                } else {
                    append(" AND archived_at IS NULL")
                }
                if (query != null) {
                    append(" AND (title ILIKE :query OR slug ILIKE :query)")
                }
                append(" ORDER BY id desc")
                append(" LIMIT :limit OFFSET :offset")
            }
        return handle
            .createQuery(sql)
            .bind("limit", limit)
            .bind("offset", offset)
            .bind("query", "%$query%")
            .mapTo<PublicContentSummaryModel>()
            .list()
            .map { it.content }
    }

    override fun internalGetById(id: Int): Content? =
        handle
            .createQuery("select * from v_contents where id = :id")
            .bind("id", id)
            .mapTo<ContentModel>()
            .singleOrNull()
            ?.content

    override fun internalGetBySlug(slug: String): Content? =
        handle
            .createQuery("select * from v_contents where slug = :slug")
            .bind("slug", slug)
            .mapTo<ContentModel>()
            .singleOrNull()
            ?.content

    override fun internalGetAll(
        limit: Int,
        offset: Int,
        query: String?,
        archived: Boolean,
    ): List<ContentSummary> {
        val sql =
            buildString {
                append("select * from v_contents_summary WHERE 1 = 1".trimIndent())
                if (archived) {
                    append(" AND archived_at IS NOT NULL")
                } else {
                    append(" AND archived_at IS NULL")
                }
                if (query != null) {
                    append(" AND (title ILIKE :query OR slug ILIKE :query)")
                }
                append(" ORDER BY id desc")
                append(" LIMIT :limit OFFSET :offset")
            }
        return handle
            .createQuery(sql)
            .bind("limit", limit)
            .bind("offset", offset)
            .bind("query", "%$query%")
            .mapTo<ContentSummaryModel>()
            .list()
            .map { it.content }
    }

    override fun delete(id: Int): Boolean {
        val result =
            handle
                .createUpdate("DELETE FROM contents WHERE id = :id")
                .bind("id", id)
                .execute()
        return result > 0
    }

    override fun publish(
        id: Int,
        newState: ContentState,
        now: Instant,
    ): Boolean {
        val result =
            handle
                .createUpdate(
                    """
                   UPDATE contents
                     SET published_at = :published_at, updated_at = :updated_at, state = :newState::content_state
                     WHERE id = :id
                """,
                ).bind("published_at", now.epochSeconds)
                .bind("updated_at", now.epochSeconds)
                .bind("newState", newState.name)
                .bind("id", id)
                .execute()
        return result > 0
    }

    override fun reject(
        id: Int,
        now: Instant,
    ): Boolean {
        val result =
            handle
                .createUpdate(
                    """
                   UPDATE contents
                     SET updated_at = :updated_at, state = :newState::content_state
                     WHERE id = :id
                """,
                ).bind("updated_at", now.epochSeconds)
                .bind("newState", ContentState.REJECTED.name)
                .bind("id", id)
                .execute()
        return result > 0
    }

    override fun archive(
        id: Int,
        now: Instant,
    ): Boolean =
        handle
            .createUpdate(
                """
            UPDATE contents
            SET archived_at = :archived_at, updated_at = :updated_at
            WHERE id = :id
            """,
            ).bind("archived_at", now.epochSeconds)
            .bind("updated_at", now.epochSeconds)
            .bind("id", id)
            .execute() > 0

    override fun unarchive(
        id: Int,
        now: Instant,
    ): Boolean =
        handle
            .createUpdate(
                """
            UPDATE contents
            SET archived_at = :archived_at, updated_at = :updated_at
            WHERE id = :id
            """,
            ).bind("archived_at", now.epochSeconds)
            .bind("updated_at", now.epochSeconds)
            .bind("id", id)
            .execute() > 0

    private fun updateAuthors(
        contentId: Int,
        authors: List<ContentAuthor>,
    ) {
        if (authors.isEmpty()) return

        // Delete and replace authors
        handle
            .createUpdate("DELETE FROM content_authors WHERE content_id = :content_id")
            .bind("content_id", contentId)
            .execute()

        val batch =
            handle.prepareBatch(
                """
                insert into content_authors (content_id, author_id, role)
                values (:content_id, :author_id, :role)
                """.trimIndent(),
            )

        authors.forEachIndexed { idx, author ->
            batch
                .bind("content_id", contentId)
                .bind("author_id", author.authorId)
                .bind("role", if (idx == 0) "primary" else "secondary")
                .add()
        }

        batch.execute()
    }

    private fun updateTags(
        contentId: Int,
        tags: List<ContentTag>,
    ) {
        if (tags.isEmpty()) return
        // Delete and replace tags
        handle
            .createUpdate("DELETE FROM content_tags WHERE content_id = :content_id")
            .bind("content_id", contentId)
            .execute()
        val batch =
            handle.prepareBatch(
                """
                insert into content_tags (content_id, tag_id, role)
                values (:content_id, :tag_id, :role)
                """.trimIndent(),
            )
        tags.forEachIndexed { idx, tag ->
            batch
                .bind("content_id", contentId)
                .bind("tag_id", tag.tagId)
                .bind("role", if (idx == 0) "primary" else "secondary")
                .add()
        }

        batch.execute()
    }

    private fun updateBlocks(
        contentId: Int,
        blocks: List<NewContentBlock>,
    ) {
        if (blocks.isEmpty()) return
        // Delete and replace blocks
        handle
            .createUpdate("DELETE FROM content_blocks WHERE content_id = :content_id")
            .bind("content_id", contentId)
            .execute()
        val batch =
            handle.prepareBatch(
                """
                insert into content_blocks (content_id, type, content, media_id, position)
                values (:content_id, :type, :content, :media_id, :position)
                """.trimIndent(),
            )

        blocks.forEachIndexed { index, block ->
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
        val type: String,
        val title: String,
        val headline: String,
        val contentState: String,
        val slug: String?,
        val archivedAt: Long?,
        val publishedAt: Long?,
        val createdAt: Long,
        val updatedAt: Long,
        val categoryId: Int?,
        val categoryName: String?,
        val categorySlug: String?,
        val featuredImage: String?,
        val tags: String,
        val authors: String,
        val blocks: String,
    ) {
        private inline fun <reified T> parseJson(json: String): T {
            val objectMapper = ObjectMapper().registerKotlinModule()
            return objectMapper.readValue(json)
        }

        val content: Content
            get() =
                Content(
                    id = id,
                    type = ContentType.valueOf(type),
                    title = title,
                    headline = headline,
                    featuredImage = featuredImage?.let { parseJson<MediaSummary>(it) },
                    slug = slug,
                    category =
                        if (categoryId != null && categoryName != null && categorySlug != null) {
                            CategorySummary(
                                id = categoryId,
                                name = categoryName,
                                slug = categorySlug,
                            )
                        } else {
                            null
                        },
                    publishedAt = publishedAt?.let { Instant.fromEpochSeconds(it) },
                    archivedAt = archivedAt?.let { Instant.fromEpochSeconds(it) },
                    createdAt = Instant.fromEpochSeconds(createdAt),
                    updatedAt = Instant.fromEpochSeconds(updatedAt),
                    state = ContentState.valueOf(contentState),
                    tags = parseJson(tags),
                    authors = parseJson(authors),
                    blocks = parseJson(blocks),
                )
    }

    private data class PublicContentModel(
        val id: Int,
        val type: String,
        val title: String,
        val headline: String,
        val contentState: String,
        val slug: String,
        val archivedAt: Long?,
        val publishedAt: Long?,
        val createdAt: Long,
        val updatedAt: Long,
        val categoryId: Int,
        val categoryName: String,
        val categorySlug: String,
        val featuredImage: String?,
        val tags: String,
        val authors: String,
        val blocks: String,
    ) {
        private inline fun <reified T> parseJson(json: String): T {
            val objectMapper = ObjectMapper().registerKotlinModule()
            return objectMapper.readValue(json)
        }

        val content: Content
            get() =
                Content(
                    id = id,
                    type = ContentType.valueOf(type),
                    title = title,
                    headline = headline,
                    featuredImage = featuredImage?.let { parseJson<MediaSummary>(it) },
                    slug = slug,
                    category =
                        CategorySummary(
                            id = categoryId,
                            name = categoryName,
                            slug = categorySlug,
                        ),
                    publishedAt = publishedAt?.let { Instant.fromEpochSeconds(it) },
                    archivedAt = archivedAt?.let { Instant.fromEpochSeconds(it) },
                    createdAt = Instant.fromEpochSeconds(createdAt),
                    updatedAt = Instant.fromEpochSeconds(updatedAt),
                    state = ContentState.valueOf(contentState),
                    tags = parseJson(tags),
                    authors = parseJson(authors),
                    blocks = parseJson(blocks),
                )
    }

    private data class ContentSummaryModel(
        val id: Int,
        val type: String,
        val title: String,
        val contentState: String,
        val slug: String?,
        val createdAt: Long,
        val archivedAt: Long,
        val categoryId: Int?,
        val categoryName: String?,
        val featuredImage: String?,
        val authors: String,
    ) {
        val content: ContentSummary
            get() =
                ContentSummary(
                    id = id,
                    type = ContentType.valueOf(type),
                    title = title,
                    state = ContentState.valueOf(contentState),
                    slug = slug,
                    createdAt = Instant.fromEpochSeconds(createdAt),
                    archivedAt = Instant.fromEpochSeconds(archivedAt),
                    categoryId = categoryId,
                    categoryName = categoryName,
                    featuredImage = featuredImage,
                    authors = authors.split(", "),
                )
    }

    private data class PublicContentSummaryModel(
        val id: Int,
        val type: String,
        val title: String,
        val contentState: String,
        val slug: String,
        val createdAt: Long,
        val archivedAt: Long,
        val categoryId: Int,
        val categoryName: String,
        val featuredImage: String,
        val authors: String,
    ) {
        val content: ContentSummary
            get() =
                ContentSummary(
                    id = id,
                    type = ContentType.valueOf(type),
                    title = title,
                    state = ContentState.valueOf(contentState),
                    slug = slug,
                    createdAt = Instant.fromEpochSeconds(createdAt),
                    archivedAt = Instant.fromEpochSeconds(archivedAt),
                    categoryId = categoryId,
                    categoryName = categoryName,
                    featuredImage = featuredImage,
                    authors = authors.split(", "),
                )
    }
}
