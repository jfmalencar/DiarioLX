package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.content.NewContent
import pt.ipl.diariolx.domain.tag.TagSummary
import pt.ipl.diariolx.repository.ContentRepository
import java.time.LocalDate

class ContentRepositoryMem : ContentRepository {
    private val categoryRepo = CategoryRepositoryMem()
    private val tagRepo = TagRepositoryMem()

    private val contents = mutableListOf<Content>()
    private var currentId = 0

    override fun create(content: NewContent): Int {
        val id = ++currentId

        val category = categoryRepo.getById(content.categoryId) ?: error("Category not found")
        val tags =
            content.tags.map {
                val tag = tagRepo.getById(it.tagId) ?: error("Tag not found")
                TagSummary(tag.id, tag.name, tag.name)
            }

        val newContent =
            Content(
                id = id,
                title = content.title,
                slug = content.slug,
                type = content.type,
                headline = content.headline,
                featuredImage = null,
                category = CategorySummary(id = category.id, name = category.name, category.slug),
                tags = tags,
                blocks = listOf(),
                authors = content.authors.map { Author(it.authorId, "Name", "PHOTOGRAPHER", "author") },
                createdAt = Clock.System.now(),
                updatedAt = Clock.System.now(),
                publishedAt = Clock.System.now(),
            )

        contents.add(newContent)
        return id
    }

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
    ): List<ContentSummary> =
        contents
            .filter {
                !archived || it.archivedAt != null && (if (query == null) true else it.title.contains(query))
            }.map {
                ContentSummary(
                    id = it.id,
                    title = it.title,
                    slug = it.slug,
                    category = CategorySummary(it.category.id, it.category.name, it.category.slug),
                    tag = TagSummary(1, "Tag Test", "tag"),
                    featuredImage = it.featuredImage?.url,
                    createdAt = it.createdAt.toString(),
                    authors = it.authors.map { a -> a.name },
                    isPublished = it.publishedAt != null,
                )
            }

    override fun delete(id: Int): Boolean {
        if (contents.none { it.id == id }) return false
        contents.removeIf { it.id == id }
        return true
    }

    override fun getById(id: Int): Content? = contents.find { it.id == id }

    override fun getBySlug(slug: String): Content? = contents.find { it.slug == slug }

    override fun archive(id: Int): Boolean {
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

    override fun unarchive(id: Int): Boolean {
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
}
