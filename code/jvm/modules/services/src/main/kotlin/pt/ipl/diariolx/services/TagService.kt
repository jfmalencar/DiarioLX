package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.PageResponse
import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.domain.tag.Tag
import pt.ipl.diariolx.domain.tag.TagUpdate
import pt.ipl.diariolx.repository.Transaction
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.Failure
import pt.ipl.diariolx.utils.TagCreateResult
import pt.ipl.diariolx.utils.TagError
import pt.ipl.diariolx.utils.TagResult
import pt.ipl.diariolx.utils.TagUpdateResult
import pt.ipl.diariolx.utils.TagValidationResult
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.paginate
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
        val name = (if (name.isNullOrBlank()) null else name) ?: return failure(TagError.EmptyName)
        val slug = Slug.parse(slug) ?: return failure(TagError.InvalidSlug)

        return transactionManager.run { tx ->
            validateData(tx, null, slug).let {
                if (it is Failure) return@run it
            }
            val tagId = tx.tagRepository.create(name, slug, description)
            success(tagId)
        }
    }

    fun update(
        id: Int,
        name: String?,
        slug: String?,
        description: String?,
    ): TagUpdateResult {
        val name = (if (name.isNullOrBlank()) null else name) ?: return failure(TagError.EmptyName)
        val slug = Slug.parse(slug) ?: return failure(TagError.InvalidSlug)

        return transactionManager.run { tx ->
            validateData(tx, id, slug).let {
                if (it is Failure) return@run it
            }
            val tag = TagUpdate(id, name, slug, description)
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

    fun getBySlug(slug: String): Tag? =
        transactionManager.run { tx ->
            Slug.parse(slug)?.let { tx.tagRepository.getBySlug(it) }
        }

    fun getAll(
        page: Int,
        size: Int,
        query: String?,
        archived: Boolean,
    ): PageResponse<Tag> =
        transactionManager.run {
            paginate(page, size) { limit, offset ->
                it.tagRepository.getAll(limit, offset, query, archived)
            }
        }

    fun delete(id: Int): TagUpdateResult =
        transactionManager.run {
            if (it.tagRepository.hasContents(id)) {
                return@run failure(TagError.TagHasContents)
            }
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

    private fun validateData(
        tx: Transaction,
        id: Int?,
        slug: Slug,
    ): TagValidationResult {
        val existing = tx.tagRepository.getBySlug(slug)
        if (existing != null && existing.id != id) {
            return failure(TagError.SlugAlreadyExists)
        }
        return success(Unit)
    }
}
