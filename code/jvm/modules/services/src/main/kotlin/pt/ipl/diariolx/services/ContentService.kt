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
import pt.ipl.diariolx.utils.Embed
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
    companion object {
        const val MIN_PHOTO_ESSAY_IMAGES = 3
    }

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
        parentId: Int?,
        embedUrl: String?,
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
            val content = tx.contentRepository.internalGetById(id) ?: return@run failure(ContentError.ContentNotFound)
            categoryId?.let {
                tx.categoryRepository.getById(it) ?: return@run failure(ContentError.CategoryNotFound)
            }
            featuredMediaId?.let {
                tx.mediaRepository.get(it) ?: return@run failure(ContentError.FeaturedMediaIdNotFound)
            }
            // Only episodes carry a parent, and it must be a podcast.
            val resolvedParentId =
                if (content.type == ContentType.EPISODE) {
                    parentId?.also {
                        val parent = tx.contentRepository.internalGetById(it)
                        if (parent == null || parent.type != ContentType.PODCAST) {
                            return@run failure(ContentError.InvalidParent)
                        }
                    }
                } else {
                    null
                }

            // The primary embed is YouTube for videos, Spotify for episodes; ignored elsewhere.
            val embed = embedUrl?.takeIf { it.isNotBlank() }
            val resolvedEmbedUrl =
                when (content.type) {
                    ContentType.VIDEO -> embed?.also { if (!Embed.isYoutube(it)) return@run failure(ContentError.InvalidEmbed) }
                    ContentType.EPISODE -> embed?.also { if (!Embed.isSpotify(it)) return@run failure(ContentError.InvalidEmbed) }
                    else -> null
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
                    resolvedParentId,
                    resolvedEmbedUrl,
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

    fun publish(id: Int): ContentUpdateResult = send(id, ContentState.PUBLISHED)

    fun submit(id: Int): ContentUpdateResult = send(id, ContentState.PENDING_REVIEW)

    fun send(
        id: Int,
        newState: ContentState,
    ): ContentUpdateResult {
        return transactionManager.run { tx ->
            val content = tx.contentRepository.internalGetById(id) ?: return@run failure(ContentError.ContentNotFound)
            if (content.title.isBlank()) {
                return@run failure(ContentError.EmptyField)
            }
            if (content.headline.isBlank()) {
                return@run failure(ContentError.EmptyField)
            }
            if (content.slug == null) {
                return@run failure(ContentError.EmptyField)
            }
            // Episodes belong to a podcast (and inherit its category) instead of
            // having one of their own.
            if (content.type == ContentType.EPISODE) {
                if (content.parentId == null) {
                    return@run failure(ContentError.ParentRequired)
                }
            } else if (content.category == null) {
                return@run failure(ContentError.EmptyField)
            }
            // Videos and episodes may instead provide an external embed (YouTube/Spotify).
            val canEmbed = content.type == ContentType.VIDEO || content.type == ContentType.EPISODE
            if (content.featuredImage == null && !(canEmbed && content.embedUrl != null)) {
                return@run failure(ContentError.EmptyField)
            }
            if (content.type == ContentType.PHOTO_ESSAY) {
                val photoCount = content.blocks.filter { it.type == "GALLERY" }.sumOf { it.images.size }
                if (photoCount < MIN_PHOTO_ESSAY_IMAGES) {
                    return@run failure(ContentError.InsufficientPhotos)
                }
            }
            tx.contentRepository.publish(id, newState, clock.now())
            return@run success(Unit)
        }
    }

    fun reject(id: Int): ContentUpdateResult {
        return transactionManager.run { tx ->
            tx.contentRepository.internalGetById(id) ?: return@run failure(ContentError.ContentNotFound)
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
        state: ContentState?,
        type: ContentType?,
        category: String?,
        user: User,
    ): PageResponse<ContentSummary> {
        val authorId = if (user.role < UserRole.EDITOR && state != ContentState.PUBLISHED) user.id else null
        return transactionManager.run {
            paginate(page, size) { limit, offset ->
                it.contentRepository.getAll(
                    limit = limit,
                    offset = offset,
                    query = query,
                    category = category,
                    state = state,
                    type = type,
                    authorId = authorId,
                )
            }
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
}
