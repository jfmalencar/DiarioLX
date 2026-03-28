package pt.ipl.diariolx.repository.mem

import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.domain.category.NewCategory
import pt.ipl.diariolx.domain.category.UpdateCategory
import pt.ipl.diariolx.repository.CategoryRepository

class CategoryRepositoryMem : CategoryRepository {
    private val categories = mutableListOf<Category>()
    private var currentId = 0

    override fun create(category: NewCategory): Int {
        val id = ++currentId
        val newCategory =
            Category(
                id = id,
                name = category.name,
                description = category.description,
                color = category.color,
                slug = category.slug,
                quantity = 0,
                createdAt = Clock.System.now(),
                updatedAt = Clock.System.now(),
            )
        categories.add(newCategory)
        return id
    }

    override fun update(category: UpdateCategory): Boolean {
        val categoryToUpdate = categories.find { it.id == category.id }
        if (categoryToUpdate != null) {
            val categoryUpdated =
                Category(
                    id = categoryToUpdate.id,
                    name = category.name,
                    description = category.description,
                    slug = category.slug,
                    color = category.color,
                    quantity = categoryToUpdate.quantity,
                    createdAt = categoryToUpdate.createdAt,
                    updatedAt = Clock.System.now(),
                )
            categories.remove(categoryToUpdate)
            categories.add(categoryUpdated)
            return true
        }
        return false
    }

    override fun getAll(
        page: Int,
        limit: Int,
        archived: Boolean,
    ): List<Category> = categories.filter { !archived || it.archivedAt != null }

    override fun delete(id: Int): Boolean {
        if (categories.none { it.id == id }) return false
        categories.removeIf { it.id == id }
        return true
    }

    override fun getById(id: Int): Category? = categories.find { it.id == id }

    override fun getBySlug(slug: String): Category? = categories.find { it.slug == slug }

    override fun archive(id: Int): Boolean {
        val categoryToArchive = categories.find { it.id == id }
        if (categoryToArchive != null) {
            val now = Clock.System.now()
            val categoryArchived = categoryToArchive.copy(archivedAt = now, updatedAt = now)
            categories.remove(categoryToArchive)
            categories.add(categoryArchived)
            return true
        }
        return false
    }

    override fun unarchive(id: Int): Boolean {
        val categoryToUnarchive = categories.find { it.id == id }
        if (categoryToUnarchive != null) {
            val now = Clock.System.now()
            val categoryArchived = categoryToUnarchive.copy(archivedAt = null, updatedAt = now)
            categories.remove(categoryToUnarchive)
            categories.add(categoryArchived)
            return true
        }
        return false
    }
}
