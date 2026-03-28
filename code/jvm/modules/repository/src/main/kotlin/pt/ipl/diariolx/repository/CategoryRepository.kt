package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.domain.category.NewCategory
import pt.ipl.diariolx.domain.category.UpdateCategory

interface CategoryRepository {
    fun create(category: NewCategory): Int

    fun getById(id: Int): Category?

    fun getBySlug(slug: String): Category?

    fun getAll(
        page: Int,
        limit: Int,
        archived: Boolean,
    ): List<Category>

    fun delete(id: Int): Boolean

    fun update(category: UpdateCategory): Boolean

    fun archive(id: Int): Boolean

    fun unarchive(id: Int): Boolean
}
