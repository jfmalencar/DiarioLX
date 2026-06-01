package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.domain.category.CategoryUpdate
import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.shared.value.Slug

interface CategoryRepository {
    fun create(
        name: String,
        slug: Slug,
        description: String? = null,
        color: Color,
        parentId: Int? = null,
    ): Int

    fun getById(id: Int): Category?

    fun getBySlug(slug: Slug): Category?

    fun getAll(
        limit: Int,
        offset: Int,
        query: String?,
        archived: Boolean,
    ): List<Category>

    fun delete(id: Int): Boolean

    fun update(category: CategoryUpdate): Boolean

    fun archive(id: Int): Boolean

    fun unarchive(id: Int): Boolean
}
