package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.PageResponse
import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.domain.category.CategoryUpdate
import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.CategoryCreateResult
import pt.ipl.diariolx.utils.CategoryError
import pt.ipl.diariolx.utils.CategoryResult
import pt.ipl.diariolx.utils.CategoryUpdateResult
import pt.ipl.diariolx.utils.CategoryValidationResult
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.paginate
import pt.ipl.diariolx.utils.success

@Named
class CategoryService(
    private val transactionManager: TransactionManager,
) {
    fun create(
        name: String?,
        slug: String?,
        description: String?,
        color: String?,
        parentId: Int?,
    ): CategoryCreateResult {
        val name = (if (name.isNullOrBlank()) null else name) ?: return failure(CategoryError.EmptyName)
        val color = Color.parse(color) ?: return failure(CategoryError.InvalidColor)
        val slug = Slug.parse(slug) ?: return failure(CategoryError.InvalidSlug)

        return transactionManager.run { tx ->
            validateData(tx, null, slug, parentId).let {
                if (it is Failure) return@run it
            }
            val categoryId = tx.categoryRepository.create(name, slug, description, color, parentId)
            success(categoryId)
        }
    }

    fun update(
        id: Int,
        name: String?,
        slug: String?,
        description: String?,
        color: String?,
        parentId: Int?,
    ): CategoryUpdateResult {
        val name = (if (name.isNullOrBlank()) null else name) ?: return failure(CategoryError.EmptyName)
        val color = Color.parse(color) ?: return failure(CategoryError.InvalidColor)
        val slug = Slug.parse(slug) ?: return failure(CategoryError.InvalidSlug)

        return transactionManager.run { tx ->
            validateData(tx, id, slug, parentId).let {
                if (it is Failure) return@run it
            }
            val category = CategoryUpdate(id, name, slug, description, color, parentId)
            tx.categoryRepository.update(category)
            success(Unit)
        }
    }

    fun get(id: Int): CategoryResult =
        transactionManager.run {
            val category = it.categoryRepository.getById(id)
            if (category == null) {
                return@run failure(CategoryError.CategoryNotFound)
            } else {
                return@run success(category)
            }
        }

    fun getBySlug(slug: String): Category? =
        transactionManager.run { tx ->
            Slug.parse(slug)?.let { tx.categoryRepository.getBySlug(it) }
        }

    fun getAll(
        page: Int,
        size: Int,
        query: String?,
        archived: Boolean,
    ): PageResponse<Category> =
        transactionManager.run {
            paginate(page, size) { limit, offset ->
                it.categoryRepository.getAll(limit, offset, query, archived)
            }
        }

    fun delete(id: Int): CategoryUpdateResult =
        transactionManager.run {
            if (it.categoryRepository.hasContents(id)) {
                return@run failure(CategoryError.CategoryHasContents)
            }
            val result = it.categoryRepository.delete(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(CategoryError.CategoryNotFound)
            }
        }

    fun archive(id: Int): CategoryUpdateResult =
        transactionManager.run {
            val result = it.categoryRepository.archive(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(CategoryError.CategoryNotFound)
            }
        }

    fun unarchive(id: Int): CategoryUpdateResult =
        transactionManager.run {
            val result = it.categoryRepository.unarchive(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(CategoryError.CategoryNotFound)
            }
        }

    private fun validateData(
        tx: Transaction,
        id: Int?,
        slug: Slug,
        parentId: Int?,
    ): CategoryValidationResult {
        val existing = tx.categoryRepository.getBySlug(slug)
        if (existing != null && existing.id != id) {
            return failure(CategoryError.SlugAlreadyExists)
        }
        val parent =
            if (parentId != null) {
                tx.categoryRepository.getById(parentId)
            } else {
                null
            }
        if (parentId != null && parent == null) {
            return failure(CategoryError.InvalidParent)
        }
        return success(Unit)
    }
}
