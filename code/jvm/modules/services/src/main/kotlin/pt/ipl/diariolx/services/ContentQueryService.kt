package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.PageResponse
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.ContentError
import pt.ipl.diariolx.utils.ContentResult
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.paginate
import pt.ipl.diariolx.utils.success
import java.time.LocalDate

@Named
class ContentQueryService(
    private val transactionManager: TransactionManager,
) {
    fun getPublishedBySlug(slug: String): ContentResult =
        transactionManager.run {
            val content = it.contentRepository.getBySlug(slug)
            if (content == null) {
                return@run failure(ContentError.ContentNotFound)
            } else if (content.state != ContentState.PUBLISHED) {
                return@run failure(ContentError.ContentNotFound)
            } else {
                return@run success(content)
            }
        }

    fun getPublished(
        page: Int = 1,
        size: Int,
        query: String? = null,
        category: String? = null,
        tag: String? = null,
        type: ContentType? = null,
        from: LocalDate? = null,
        to: LocalDate? = null,
        parentId: Int? = null,
        author: String? = null,
        creditedTo: String? = null,
    ): PageResponse<ContentSummary> =
        transactionManager.run {
            paginate(page, size) { limit, offset ->
                it.contentRepository.getAll(
                    limit = limit,
                    offset = offset,
                    type = type,
                    query = query,
                    tag = tag,
                    category = category,
                    state = ContentState.PUBLISHED,
                    from = from,
                    to = to,
                    parentId = parentId,
                    author = author,
                    creditedTo = creditedTo,
                )
            }
        }
}
