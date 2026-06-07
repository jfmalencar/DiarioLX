package pt.ipl.diariolx.services

import jakarta.inject.Named
import kotlinx.datetime.Clock
import pt.ipl.diariolx.domain.PageResponse
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.content.UpdateContent
import pt.ipl.diariolx.domain.content.value.ContentAuthor
import pt.ipl.diariolx.domain.content.value.ContentTag
import pt.ipl.diariolx.domain.content.value.NewContentBlock
import pt.ipl.diariolx.domain.users.User
import pt.ipl.diariolx.domain.users.UserRole
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
    private val clock: Clock,
) {
    fun createEmpty(type: String): ContentCreateResult {
        val type =
            try {
                ContentType.valueOf(type.uppercase())
            } catch (e: IllegalArgumentException) {
                return failure(ContentError.InvalidType)
            }
        return transactionManager.run { tx ->
            val contentId = tx.contentRepository.createEmpty(type, clock.now())
            success(contentId)
        }
    }

    fun update(
        id: Int,
        title: String,
        headline: String,
        featuredMediaId: Int?,
        slug: String?,
        categoryId: Int?,
        authors: List<ContentAuthor>,
        tags: List<ContentTag>,
        blocks: List<NewContentBlock>,
    ): ContentUpdateResult {
        // if (title.isBlank()) return failure(ContentError.EmptyField)
        // if (headline.isBlank()) return failure(ContentError.EmptyField)
        slug?.let {
            if (it.isBlank()) return failure(ContentError.InvalidSlug)
        }
        return transactionManager.run { tx ->
            tx.contentRepository.internalGetById(id) ?: return@run failure(ContentError.ContentNotFound)
            categoryId?.let {
                tx.categoryRepository.getById(it) ?: return@run failure(ContentError.CategoryNotFound)
            }
            featuredMediaId?.let {
                tx.mediaRepository.get(it) ?: return@run failure(ContentError.FeaturedMediaIdNotFound)
            }
            slug?.let {
                tx.contentRepository.internalGetBySlug(it)?.let { existing ->
                    if (existing.id != id) {
                        return@run failure(ContentError.SlugAlreadyExists)
                    }
                }
            }
            for (author in authors) {
                tx.userRepository.getById(author.authorId) ?: return@run failure(ContentError.AuthorNotFound)
            }
            for (tag in tags) {
                tx.tagRepository.getById(tag.tagId) ?: return@run failure(ContentError.TagNotFound)
            }
            val updateContent =
                UpdateContent(
                    id,
                    title,
                    headline,
                    featuredMediaId,
                    slug,
                    categoryId,
                    authors,
                    tags,
                    blocks,
                    ContentState.DRAFT,
                )
            tx.contentRepository.updateContent(updateContent, clock.now())
            return@run success(Unit)
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

    fun publish(
        me: User,
        id: Int,
    ): ContentUpdateResult {
        val newState =
            if (me.role == UserRole.CONTRIBUTOR) {
                ContentState.PENDING_REVIEW
            } else {
                ContentState.PUBLISHED
            }
        return transactionManager.run { tx ->
            val content = tx.contentRepository.internalGetById(id) ?: return@run failure(ContentError.ContentNotFound)
            if (content.slug == null) {
                return@run failure(ContentError.EmptyField)
            }
            if (content.category == null) {
                return@run failure(ContentError.EmptyField)
            }
            if (content.featuredImage == null) {
                return@run failure(ContentError.EmptyField)
            }
            tx.contentRepository.publish(id, newState, clock.now())
            return@run success(Unit)
        }
    }

    fun reject(id: Int): ContentUpdateResult {
        return transactionManager.run { tx ->
            val content = tx.contentRepository.internalGetById(id) ?: return@run failure(ContentError.ContentNotFound)
            if (content.slug == null) {
                return@run failure(ContentError.EmptyField)
            }
            if (content.category == null) {
                return@run failure(ContentError.EmptyField)
            }
            if (content.featuredImage == null) {
                return@run failure(ContentError.EmptyField)
            }
            tx.contentRepository.reject(id, clock.now())
            return@run success(Unit)
        }
    }

    fun archive(id: Int): ContentUpdateResult =
        transactionManager.run {
            val result = it.contentRepository.archive(id, clock.now())
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(ContentError.ContentNotFound)
            }
        }

    fun unarchive(id: Int): ContentUpdateResult =
        transactionManager.run {
            val result = it.contentRepository.unarchive(id, clock.now())
            if (result) {
                return@run success(Unit)
            } else {
                return@run failure(ContentError.ContentNotFound)
            }
        }

    fun getById(id: Int): ContentResult =
        transactionManager.run {
            val content = it.contentRepository.getById(id)
            if (content == null) {
                return@run failure(ContentError.ContentNotFound)
            } else {
                return@run success(content)
            }
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

    fun internalGetById(id: Int): ContentResult =
        transactionManager.run {
            val content = it.contentRepository.internalGetById(id)
            if (content == null) {
                return@run failure(ContentError.ContentNotFound)
            } else {
                return@run success(content)
            }
        }

    fun internalGetBySlug(slug: String): ContentResult =
        transactionManager.run {
            val content = it.contentRepository.internalGetBySlug(slug)
            if (content == null) {
                return@run failure(ContentError.ContentNotFound)
            } else {
                return@run success(content)
            }
        }

    fun internalGetAll(
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
}
