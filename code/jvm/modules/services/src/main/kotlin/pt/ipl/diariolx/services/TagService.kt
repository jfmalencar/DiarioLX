package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.tag.NewTag
import pt.ipl.diariolx.domain.tag.Tag
import pt.ipl.diariolx.domain.tag.UpdateTag
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.SlugValidator
import pt.ipl.diariolx.utils.TagCreateResult
import pt.ipl.diariolx.utils.TagError
import pt.ipl.diariolx.utils.TagResult
import pt.ipl.diariolx.utils.TagUpdateResult
import pt.ipl.diariolx.utils.TagValidationResult
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.success

@Named
class TagService(
    private val transactionManager: TransactionManager,
) {
    fun create(
        name: String?,
        slug: String?,
        description: String?,
    ): TagCreateResult {
        validateInputs(name, slug).let {
            if (it is Failure) return it
        }
        return transactionManager.run { tx ->
            validateData(tx, null, slug).let {
                if (it is Failure) return@run it
            }
            val newTag = NewTag(name!!, slug!!, description)
            val tagId = tx.tagRepository.create(newTag)
            success(tagId)
        }
    }

    fun update(
        id: Int,
        name: String?,
        slug: String?,
        description: String?,
    ): TagUpdateResult {
        validateInputs(name, slug).let {
            if (it is Failure) return it
        }
        return transactionManager.run { tx ->
            validateData(tx, id, slug).let {
                if (it is Failure) return@run it
            }
            val tag = UpdateTag(id, name!!, slug!!, description)
            tx.tagRepository.update(tag)
            success(Unit)
        }
    }

    fun get(id: Int): TagResult =
        transactionManager.run {
            val tag = it.tagRepository.getById(id)
            if (tag == null) {
                return@run failure(TagError.TagNotFound)
            } else {
                return@run success(tag)
            }
        }

    fun getAll(
        page: Int,
        limit: Int,
        archived: Boolean,
    ): List<Tag> =
        transactionManager.run {
            it.tagRepository.getAll(page, limit, archived)
        }

    fun delete(id: Int): TagUpdateResult =
        transactionManager.run {
            val result = it.tagRepository.delete(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(TagError.TagNotFound)
            }
        }

    fun archive(id: Int): TagUpdateResult =
        transactionManager.run {
            val result = it.tagRepository.archive(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(TagError.TagNotFound)
            }
        }

    fun unarchive(id: Int): TagUpdateResult =
        transactionManager.run {
            val result = it.tagRepository.unarchive(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(TagError.TagNotFound)
            }
        }

    private fun validateInputs(
        name: String?,
        slug: String?,
    ): TagValidationResult {
        if (name.isNullOrBlank()) {
            return failure(TagError.EmptyName)
        }
        if (slug.isNullOrEmpty() || SlugValidator.isValid(slug).not()) {
            return failure(TagError.InvalidSlug)
        }
        return success(Unit)
    }

    private fun validateData(
        tx: Transaction,
        id: Int?,
        slug: String?,
    ): TagValidationResult {
        val existing = tx.tagRepository.getBySlug(slug!!)
        if (existing != null && existing.id != id) {
            return failure(TagError.SlugAlreadyExists)
        }
        return success(Unit)
    }
}
