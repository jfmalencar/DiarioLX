package pt.ipl.diariolx.services

import jakarta.inject.Named
import kotlinx.datetime.Clock
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
    private val clock: Clock,
) {
    fun getPublishedBySlug(slug: String): ContentResult =
        transactionManager.run {
            val content = it.contentRepository.getPublishedBySlug(slug)
            if (content == null || !content.isVisibleAt(clock.now())) {
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
                    types = type?.let { listOf(it) },
                    query = query,
                    tag = tag,
                    category = category,
                    state = ContentState.APPROVED,
                    from = from,
                    to = to,
                    parentId = parentId,
                    author = author,
                    creditedTo = creditedTo,
                    excludeArchivedCategory = true,
                    archived = false,
                    orderBy = "published_at",
                    published = true,
                )
            }
        }
}
