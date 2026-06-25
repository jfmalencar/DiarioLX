package pt.ipl.diariolx.repository

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentHistory
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.content.ReviewAction
import pt.ipl.diariolx.domain.content.UpdateContent
import pt.ipl.diariolx.domain.content.value.ContentAuthor
import pt.ipl.diariolx.domain.content.value.ContentParent
import pt.ipl.diariolx.domain.content.value.ContentTag
import pt.ipl.diariolx.domain.content.value.NewContentBlock
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.domain.tag.TagSummary
import java.time.LocalDate

// Shared across all row models in this file — registering the Kotlin module is
// not free, so we do it once instead of per-row.
private val contentJson = ObjectMapper().registerKotlinModule()

private inline fun <reified T> parseJson(json: String): T = contentJson.readValue(json)

private fun epoch(seconds: Long?): Instant? = seconds?.let { Instant.fromEpochSeconds(it) }

private fun categorySummaryOf(
    id: Int?,
    name: String?,
    slug: String?,
    color: String?,
): CategorySummary? =
    if (id != null && name != null && slug != null && color != null) {
        CategorySummary(id, name, Slug(slug), Color(color))
    } else {
        null
    }

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
                slug = :slug, category_id = :category_id, parent_id = :parent_id, embed_url = :embed_url,
                updated_at = :updated_at, published_at = NULL, state = 'new_state'::content_state
                WHERE id = :id
                """,
            ).bind("title", content.title)
            .bind("headline", content.headline)
            .bind("featured_media_id", content.featuredMediaId)
            .bind("slug", content.slug)
            .bind("category_id", content.categoryId)
            .bind("parent_id", content.parentId)
            .bind("embed_url", content.embedUrl)
            .bind("updated_at", now.epochSeconds)
            .bind("new_state", content.state.name)
            .bind("id", contentId)
            .execute()

        updateAuthors(contentId, content.authors)
        updateTags(contentId, content.tags)
        updateBlocks(contentId, content.blocks)
    }

    override fun getById(id: Int): Content? = findContent("v_published_contents", "id", id)

    override fun getBySlug(slug: String): Content? = findContent("v_published_contents", "slug", slug)

    override fun internalGetById(id: Int): Content? = findContent("v_contents", "id", id)

    override fun internalGetBySlug(slug: String): Content? = findContent("v_contents", "slug", slug)

    private fun findContent(
        view: String,
        column: String,
        value: Any,
    ): Content? =
        handle
            .createQuery("select * from $view where $column = :value")
            .bind("value", value)
            .mapTo<ContentModel>()
            .singleOrNull()
            ?.content

    override fun getAll(
        limit: Int,
        offset: Int,
        type: ContentType?,
        query: String?,
        state: ContentState?,
        tag: String?,
        category: String?,
        from: LocalDate?,
        to: LocalDate?,
        authorId: Int?,
        parentId: Int?,
        author: String?,
        creditedTo: String?,
    ): List<ContentSummary> {
        val conditions =
            buildList {
                if (query != null) add("(title ILIKE :query OR slug ILIKE :query)")
                if (type != null) add("type = :type")
                if (tag != null) add("tag_slug = :tag")
                if (category != null) add("category_slug = :category")
                if (parentId != null) add("parent_id = :parentId")
                if (author != null) {
                    add("authors::jsonb @> jsonb_build_array(jsonb_build_object('slug', :author))")
                }
                if (creditedTo != null) {
                    // Credited on any of the content's media (featured / in-body / gallery),
                    // and not already an author (so the two views don't overlap).
                    add(
                        """
                        (EXISTS (
                            SELECT 1 FROM media_credits mc
                            JOIN users u ON u.id = mc.user_id
                            WHERE u.username = :creditedTo
                              AND mc.media_id IN (
                                  SELECT featured_media_id FROM contents WHERE id = v_contents_summary.id AND featured_media_id IS NOT NULL
                                  UNION SELECT media_id FROM content_blocks WHERE content_id = v_contents_summary.id AND media_id IS NOT NULL
                                  UNION SELECT cbi.media_id FROM content_block_images cbi
                                        JOIN content_blocks cb ON cb.id = cbi.block_id
                                        WHERE cb.content_id = v_contents_summary.id
                              )
                        )
                        AND NOT authors::jsonb @> jsonb_build_array(jsonb_build_object('slug', :creditedTo)))
                        """.trimIndent(),
                    )
                }
                if (state == ContentState.PUBLISHED) {
                    add("published_at IS NOT NULL AND published_at <= EXTRACT(EPOCH FROM NOW())")
                }
                if (state != null) add("content_state = :state::content_state")
                if (from != null) add("published_at >= :from")
                if (to != null) add("published_at <= :to")
                if (authorId != null) {
                    add("authors::jsonb @> jsonb_build_array(jsonb_build_object('id', :authorId))")
                }
            }
        return handle
            .createQuery(summaryQuery(conditions))
            .bind("limit", limit)
            .bind("offset", offset)
            .bind("query", "%$query%")
            .bind("state", state)
            .bind("type", type)
            .bind("category", category)
            .bind("tag", tag)
            .bind("from", from?.toEpochDay())
            .bind("to", to?.toEpochDay())
            .bind("authorId", authorId)
            .bind("parentId", parentId)
            .bind("author", author)
            .bind("creditedTo", creditedTo)
            .mapTo<ContentSummaryModel>()
            .list()
            .map { it.content }
    }

    override fun internalGetAll(
        limit: Int,
        offset: Int,
        query: String?,
        archived: Boolean,
    ): List<ContentSummary> {
        val conditions =
            buildList {
                add(if (archived) "archived_at IS NOT NULL" else "archived_at IS NULL")
                if (query != null) add("(title ILIKE :query OR slug ILIKE :query)")
            }
        return handle
            .createQuery(summaryQuery(conditions))
            .bind("limit", limit)
            .bind("offset", offset)
            .bind("query", "%$query%")
            .mapTo<ContentSummaryModel>()
            .list()
            .map { it.content }
    }

    override fun historyById(id: Int): List<ContentHistory> =
        handle
            .createQuery(
                """
                SELECT *
                FROM v_content_review_history
                WHERE content_id = :id
                ORDER BY performed_at DESC
                """,
            ).bind("id", id)
            .mapTo<ContentHistoryModel>()
            .list()
            .map { it.contentHistory }

    private fun summaryQuery(conditions: List<String>): String =
        buildString {
            append("select * from v_contents_summary")
            if (conditions.isNotEmpty()) {
                append(" WHERE ")
                append(conditions.joinToString(" AND "))
            }
            append(" ORDER BY id desc LIMIT :limit OFFSET :offset")
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
        comment: String?,
        reviewerId: Int?,
    ): Boolean {
        val result =
            handle
                .createUpdate(
                    """
                   UPDATE contents
                     SET published_at = :published_at, updated_at = :updated_at, state = :newState::content_state
                     WHERE id = :id
                """,
                ).bind("published_at", if (newState == ContentState.PUBLISHED) now.epochSeconds else null)
                .bind("updated_at", now.epochSeconds)
                .bind("newState", newState.name)
                .bind("id", id)
                .execute()
        if (result > 0 && newState == ContentState.PUBLISHED && reviewerId != null) {
            handle
                .createUpdate(
                    """
                        INSERT INTO content_history (content_id, performed_by, action, comment, performed_at)
                        VALUES (:id, :performed_by, 'APPROVED'::content_history_action, :comment, :performed_at)
                    """,
                ).bind("id", id)
                .bind("performed_by", reviewerId)
                .bind("comment", comment)
                .bind("performed_at", now.epochSeconds)
                .execute()
        }
        return result > 0
    }

    override fun reject(
        id: Int,
        now: Instant,
        comment: String?,
        reviewerId: Int,
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
        if (result > 0) {
            handle
                .createUpdate(
                    """
                        INSERT INTO content_history (content_id, performed_by, action, comment, performed_at)
                        VALUES (:id, :performed_by, 'REJECTED'::content_history_action, :comment, :performed_at)
                    """,
                ).bind("id", id)
                .bind("performed_by", reviewerId)
                .bind("comment", comment)
                .bind("performed_at", now.epochSeconds)
                .execute()
        }
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
        replaceRoles(
            contentId = contentId,
            deleteFrom = "content_authors",
            insertInto = "insert into content_authors (content_id, author_id, role) values (:content_id, :ref_id, :role)",
            refIds = authors.map { it.authorId },
        )
    }

    private fun updateTags(
        contentId: Int,
        tags: List<ContentTag>,
    ) {
        if (tags.isEmpty()) return
        replaceRoles(
            contentId = contentId,
            deleteFrom = "content_tags",
            insertInto = "insert into content_tags (content_id, tag_id, role) values (:content_id, :ref_id, :role)",
            refIds = tags.map { it.tagId },
        )
    }

    // content_authors / content_tags share the same "delete then re-insert with a
    // primary/secondary role" shape, so they go through one helper.
    private fun replaceRoles(
        contentId: Int,
        deleteFrom: String,
        insertInto: String,
        refIds: List<Int>,
    ) {
        handle
            .createUpdate("DELETE FROM $deleteFrom WHERE content_id = :content_id")
            .bind("content_id", contentId)
            .execute()

        val batch = handle.prepareBatch(insertInto)
        refIds.forEachIndexed { idx, refId ->
            batch
                .bind("content_id", contentId)
                .bind("ref_id", refId)
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
        // ON DELETE CASCADE also clears the old content_block_images rows.
        handle
            .createUpdate("DELETE FROM content_blocks WHERE content_id = :content_id")
            .bind("content_id", contentId)
            .execute()

        blocks.forEachIndexed { index, block ->
            val blockId =
                handle
                    .createQuery(
                        """
                        insert into content_blocks (content_id, type, content, media_id, position)
                        values (:content_id, :type::block_type, :content, :media_id, :position)
                        returning id
                        """.trimIndent(),
                    ).bind("content_id", contentId)
                    .bind("type", block.type)
                    .bind("content", block.content)
                    .bind("media_id", block.mediaId)
                    .bind("position", index)
                    .mapTo<Int>()
                    .one()

            if (block.images.isNotEmpty()) {
                val imageBatch =
                    handle.prepareBatch(
                        """
                        insert into content_block_images (block_id, media_id, caption, position)
                        values (:block_id, :media_id, :caption, :position)
                        """.trimIndent(),
                    )
                block.images.forEachIndexed { imageIndex, image ->
                    imageBatch
                        .bind("block_id", blockId)
                        .bind("media_id", image.mediaId)
                        .bind("caption", image.caption)
                        .bind("position", imageIndex)
                        .add()
                }
                imageBatch.execute()
            }
        }
    }

    private data class ContentHistoryModel(
        val contentId: Int,
        val reviewerName: String,
        val actionPerformed: String,
        val reviewComment: String?,
        val performedAt: Long,
    ) {
        val contentHistory: ContentHistory
            get() =
                ContentHistory(
                    contentId = contentId,
                    reviewerName = reviewerName,
                    action = ReviewAction.valueOf(actionPerformed),
                    comment = reviewComment,
                    performedAt = Instant.fromEpochSeconds(performedAt),
                )
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
        val categoryColor: String?,
        val parentId: Int?,
        val parent: String?,
        val embedUrl: String?,
        val featuredImage: String?,
        val tags: String,
        val authors: String,
        val blocks: String,
    ) {
        val content: Content
            get() =
                Content(
                    id = id,
                    type = ContentType.valueOf(type),
                    title = title,
                    headline = headline,
                    featuredImage = featuredImage?.let { parseJson<MediaSummary>(it) },
                    slug = slug,
                    category = categorySummaryOf(categoryId, categoryName, categorySlug, categoryColor),
                    parentId = parentId,
                    parent = parent?.let { parseJson<ContentParent>(it) },
                    embedUrl = embedUrl,
                    publishedAt = epoch(publishedAt),
                    archivedAt = epoch(archivedAt),
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
        val headline: String,
        val tagId: Int?,
        val tagName: String?,
        val tagSlug: String?,
        val contentState: String,
        val slug: String?,
        val createdAt: Long,
        val archivedAt: Long?,
        val publishedAt: Long?,
        val categoryId: Int?,
        val categorySlug: String?,
        val categoryName: String?,
        val categoryColor: String?,
        val featuredImage: String?,
        val embedUrl: String?,
        val authors: String,
    ) {
        val content: ContentSummary
            get() =
                ContentSummary(
                    id = id,
                    type = ContentType.valueOf(type),
                    title = title,
                    headline = headline,
                    state = ContentState.valueOf(contentState),
                    slug = slug,
                    category = categorySummaryOf(categoryId, categoryName, categorySlug, categoryColor),
                    tag =
                        if (tagId != null && tagName != null && tagSlug != null) {
                            TagSummary(tagId, tagName, tagSlug)
                        } else {
                            null
                        },
                    createdAt = Instant.fromEpochSeconds(createdAt),
                    archivedAt = epoch(archivedAt),
                    publishedAt = epoch(publishedAt),
                    featuredImage = featuredImage,
                    embedUrl = embedUrl,
                    authors = parseJson(authors),
                )
    }
}
