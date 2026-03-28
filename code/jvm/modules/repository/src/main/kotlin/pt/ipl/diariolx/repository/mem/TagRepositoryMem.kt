package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.tag.NewTag
import pt.ipl.diariolx.domain.tag.Tag
import pt.ipl.diariolx.domain.tag.UpdateTag
import pt.ipl.diariolx.repository.TagRepository

class TagRepositoryMem : TagRepository {
    private val tags = mutableListOf<Tag>()
    private var currentId = 0

    override fun create(tag: NewTag): Int {
        val id = ++currentId
        val newTag =
            Tag(
                id = id,
                name = tag.name,
                description = tag.description,
                slug = tag.slug,
                quantity = 0,
                createdAt = Clock.System.now(),
                updatedAt = Clock.System.now(),
            )
        tags.add(newTag)
        return id
    }

    override fun update(tag: UpdateTag): Boolean {
        val tagToUpdate = tags.find { it.id == tag.id }
        if (tagToUpdate != null) {
            val categoryUpdated =
                Tag(
                    id = tagToUpdate.id,
                    name = tag.name,
                    description = tag.description,
                    slug = tag.slug,
                    quantity = tagToUpdate.quantity,
                    createdAt = tagToUpdate.createdAt,
                    updatedAt = Clock.System.now(),
                )
            tags.remove(tagToUpdate)
            tags.add(categoryUpdated)
            return true
        }
        return false
    }

    override fun getAll(
        page: Int,
        limit: Int,
        archived: Boolean,
    ): List<Tag> = tags.filter { !archived || it.archivedAt != null }

    override fun delete(id: Int): Boolean {
        if (tags.none { it.id == id }) return false
        tags.removeIf { it.id == id }
        return true
    }

    override fun getById(id: Int): Tag? = tags.find { it.id == id }

    override fun getBySlug(slug: String): Tag? = tags.find { it.slug == slug }

    override fun archive(id: Int): Boolean {
        val tagToArchive = tags.find { it.id == id }
        if (tagToArchive != null) {
            val now = Clock.System.now()
            val tagArchived = tagToArchive.copy(archivedAt = now, updatedAt = now)
            tags.remove(tagToArchive)
            tags.add(tagArchived)
            return true
        }
        return false
    }

    override fun unarchive(id: Int): Boolean {
        val tagToUnarchive = tags.find { it.id == id }
        if (tagToUnarchive != null) {
            val now = Clock.System.now()
            val tagArchived = tagToUnarchive.copy(archivedAt = null, updatedAt = now)
            tags.remove(tagToUnarchive)
            tags.add(tagArchived)
            return true
        }
        return false
    }
}
