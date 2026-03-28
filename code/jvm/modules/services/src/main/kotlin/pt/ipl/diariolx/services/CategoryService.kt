package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.domain.category.NewCategory
import pt.ipl.diariolx.domain.category.UpdateCategory
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.CategoryCreateResult
import pt.ipl.diariolx.utils.CategoryError
import pt.ipl.diariolx.utils.CategoryResult
import pt.ipl.diariolx.utils.CategoryUpdateResult
import pt.ipl.diariolx.utils.CategoryValidationResult
import pt.ipl.diariolx.utils.ColorValidator
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.SlugValidator
import pt.ipl.diariolx.utils.failure
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
        validateInputs(name, slug, color).let {
            if (it is Failure) return it
        }
        return transactionManager.run { tx ->
            validateData(tx, null, slug, parentId).let {
                if (it is Failure) return@run it
            }
            val newCategory = NewCategory(name!!, slug!!, description, color!!, parentId)
            val categoryId = tx.categoryRepository.create(newCategory)
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
        validateInputs(name, slug, color).let {
            if (it is Failure) return it
        }
        return transactionManager.run { tx ->
            validateData(tx, id, slug, parentId).let {
                if (it is Failure) return@run it
            }
            val category = UpdateCategory(id, name!!, slug!!, description, color!!, parentId)
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

    fun getAll(
        page: Int,
        limit: Int,
        archived: Boolean,
    ): List<Category> =
        transactionManager.run {
            it.categoryRepository.getAll(page, limit, archived)
        }

    fun delete(id: Int): CategoryUpdateResult =
        transactionManager.run {
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

    private fun validateInputs(
        name: String?,
        slug: String?,
        color: String?,
    ): CategoryValidationResult {
        if (name.isNullOrBlank()) {
            return failure(CategoryError.EmptyName)
        }
        if (color.isNullOrEmpty() || ColorValidator.isValid(color).not()) {
            return failure(CategoryError.InvalidColor)
        }
        if (slug.isNullOrEmpty() || SlugValidator.isValid(slug).not()) {
            return failure(CategoryError.InvalidSlug)
        }
        return success(Unit)
    }

    private fun validateData(
        tx: Transaction,
        id: Int?,
        slug: String?,
        parentId: Int?,
    ): CategoryValidationResult {
        val existing = tx.categoryRepository.getBySlug(slug!!)
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
            return failure(CategoryError.ParentNotFound)
        }
        return success(Unit)
    }
}
