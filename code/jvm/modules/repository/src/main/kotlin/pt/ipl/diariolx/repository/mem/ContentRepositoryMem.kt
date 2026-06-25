package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.content.UpdateContent
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.tag.TagSummary
import pt.ipl.diariolx.repository.ContentRepository
import java.time.LocalDate

class ContentRepositoryMem(
    val categoryRepo: CategoryRepositoryMem,
    val tagRepo: TagRepositoryMem,
    val blockRepo: BlockRepositoryMem,
    val mediaRepo: MediaRepositoryMem,
) : ContentRepository {
    private val contents = mutableListOf<Content>()
    private var currentId = 0

    override fun createEmpty(
        type: ContentType,
        now: Instant,
    ): Int {
        val newId = ++currentId
        val newContent =
            Content(
                id = newId,
                type = type,
                title = "",
                headline = "",
                featuredImage = null,
                slug = null,
                category = null,
                publishedAt = null,
                archivedAt = null,
                createdAt = Clock.System.now(),
                updatedAt = Clock.System.now(),
                state = ContentState.DRAFT,
                tags = emptyList(),
                authors = emptyList(),
                blocks = emptyList(),
            )
        contents.add(newContent)
        return newId
    }

    override fun updateContent(
        content: UpdateContent,
        now: Instant,
    ) {
        val tags =
            content.tags.map {
                val tag = tagRepo.getById(it.tagId) ?: error("Tag not found")
                TagSummary(tag.id, tag.name, tag.name)
            }
        val authors = content.authors.map { Author(it.authorId, "Name", "PHOTOGRAPHER", "author") }
        val blocks =
            content.blocks.map { block ->
                val id = blockRepo.create(block)
                blockRepo.get(id) ?: error("Block not found")
            }

        val oldContent = contents.find { it.id == content.id } ?: error("Content not found")
        val newContent =
            Content(
                id = content.id,
                type = oldContent.type,
                title = content.title,
                headline = content.headline,
                featuredImage =
                    content.featuredMediaId?.let { mediaRepo.get(it) }?.let {
                        MediaSummary(
                            it.id,
                            it.objectKey,
                            it.thumbnailObjectKey,
                            it.altText,
                            it.mimeType,
                            it.sizeBytes,
                        )
                    },
                slug = content.slug,
                category = categoryRepo.getById(content.categoryId ?: -1)?.let { CategorySummary(it.id, it.name, it.slug, it.color) },
                parentId = content.parentId,
                embedUrl = content.embedUrl,
                publishedAt = null,
                archivedAt = null,
                createdAt = Clock.System.now(),
                updatedAt = Clock.System.now(),
                state = ContentState.DRAFT,
                tags = tags,
                authors = authors,
                blocks = blocks,
            )
        contents.removeIf { it.id == content.id }
        contents.add(newContent)
    }

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
    ): List<ContentSummary> =
        contents
            .filter { content ->
                (parentId == null || content.parentId == parentId) &&
                content.state == ContentState.PUBLISHED &&
                    content.slug != null &&
                    content.category != null &&
                    (
                        if (query ==
                            null
                        ) {
                            true
                        } else {
                            content.title.contains(query, ignoreCase = true) ||
                                (content.slug?.contains(query, ignoreCase = true) ?: false)
                        }
                    )
            }.drop(offset)
            .take(limit)
            .map {
                ContentSummary(
                    id = it.id,
                    type = it.type,
                    title = it.title,
                    headline = it.headline,
                    state = it.state,
                    slug = it.slug,
                    category = it.category?.let { c -> CategorySummary(c.id, c.name, c.slug, c.color) },
                    tag = TagSummary(1, "Tag Test", "tag"),
                    createdAt = it.createdAt,
                    archivedAt = it.archivedAt,
                    publishedAt = it.publishedAt,
                    featuredImage = it.featuredImage?.path,
                    authors = it.authors,
                )
            }

    override fun internalGetById(id: Int): Content? = contents.find { it.id == id }

    override fun internalGetBySlug(slug: String): Content? {
        TODO("Not yet implemented")
    }

    override fun internalGetAll(
        limit: Int,
        offset: Int,
        query: String?,
        archived: Boolean,
    ): List<ContentSummary> =
        contents
            .filter { content ->
                (if (archived) content.archivedAt != null else content.archivedAt == null) &&
                    (
                        if (query ==
                            null
                        ) {
                            true
                        } else {
                            content.title.contains(query, ignoreCase = true) ||
                                (content.slug?.contains(query, ignoreCase = true) ?: false)
                        }
                    )
            }.drop(offset)
            .take(limit)
            .map {
                ContentSummary(
                    id = it.id,
                    type = it.type,
                    title = it.title,
                    headline = it.headline,
                    state = it.state,
                    slug = it.slug,
                    createdAt = it.createdAt,
                    archivedAt = it.archivedAt,
                    publishedAt = it.publishedAt,
                    featuredImage = it.featuredImage?.path,
                    authors = it.authors,
                    category = null,
                    tag = null,
                )
            }

    override fun delete(id: Int): Boolean {
        if (contents.none { it.id == id }) return false
        contents.removeIf { it.id == id }
        return true
    }

    override fun getById(id: Int): Content? = contents.find { it.id == id && it.state == ContentState.PUBLISHED && it.slug != null }

    override fun getBySlug(slug: String): Content? = contents.find { it.slug == slug && it.state == ContentState.PUBLISHED }

    override fun archive(
        id: Int,
        now: Instant,
    ): Boolean {
        val contentToArchive = contents.find { it.id == id }
        if (contentToArchive != null) {
            val now = Clock.System.now()
            val contentArchived = contentToArchive.copy(archivedAt = now, updatedAt = now)
            contents.remove(contentToArchive)
            contents.add(contentArchived)
            return true
        }
        return false
    }

    override fun unarchive(
        id: Int,
        now: Instant,
    ): Boolean {
        val contentToUnarchive = contents.find { it.id == id }
        if (contentToUnarchive != null) {
            val now = Clock.System.now()
            val contentArchived = contentToUnarchive.copy(archivedAt = null, updatedAt = now)
            contents.remove(contentToUnarchive)
            contents.add(contentArchived)
            return true
        }
        return false
    }

    override fun publish(
        id: Int,
        newState: ContentState,
        now: Instant,
    ): Boolean {
        TODO("Not yet implemented")
    }

    override fun reject(
        id: Int,
        now: Instant,
    ): Boolean {
        TODO("Not yet implemented")
    }
}
