package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.domain.category.UpdateCategory

interface CategoryRepository {
    fun create(
        name: String,
        slug: String,
        description: String? = null,
        color: String,
        parentId: Int? = null,
    ): Int

    fun getById(id: Int): Category?

    fun getBySlug(slug: String): Category?

    fun getAll(
        limit: Int,
        offset: Int,
        query: String?,
        archived: Boolean,
    ): List<Category>

    fun delete(id: Int): Boolean

    fun update(category: UpdateCategory): Boolean

    fun archive(id: Int): Boolean

    fun unarchive(id: Int): Boolean
}
