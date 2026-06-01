package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.PageResponse
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.NewContent
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.ContentCreateResult
import pt.ipl.diariolx.utils.ContentError
import pt.ipl.diariolx.utils.ContentResult
import pt.ipl.diariolx.utils.ContentUpdateResult
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.paginate
import pt.ipl.diariolx.utils.success

@Named
class ContentService(
    private val transactionManager: TransactionManager,
) {
    fun create(newContent: NewContent): ContentCreateResult =
        transactionManager.run { tx ->
            val tagId = tx.contentRepository.create(newContent)
            success(tagId)
        }

    fun getBySlug(slug: String): ContentResult =
        transactionManager.run {
            val content = it.contentRepository.getBySlug(slug)
            if (content == null) {
                return@run failure(ContentError.ContentNotFound)
            } else {
                return@run success(content)
            }
        }

    fun getAll(
        page: Int,
        size: Int,
        query: String?,
        archived: Boolean,
    ): PageResponse<ContentSummary> =
        transactionManager.run {
            paginate(page, size) { limit, offset ->
                it.contentRepository.getAll(
                    limit = limit,
                    offset = offset,
                    query = query,
                    archived = archived,
                )
            }
        }

    fun delete(id: Int): ContentUpdateResult =
        transactionManager.run {
            val result = it.contentRepository.delete(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(ContentError.ContentNotFound)
            }
        }

    fun archive(id: Int): ContentUpdateResult =
        transactionManager.run {
            val result = it.contentRepository.archive(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(ContentError.ContentNotFound)
            }
        }

    fun unarchive(id: Int): ContentUpdateResult =
        transactionManager.run {
            val result = it.contentRepository.unarchive(id)
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(ContentError.ContentNotFound)
            }
        }
}
