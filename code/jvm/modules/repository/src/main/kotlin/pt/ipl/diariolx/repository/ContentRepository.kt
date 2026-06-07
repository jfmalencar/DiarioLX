package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.content.UpdateContent
import java.time.LocalDate

interface ContentRepository {
    fun createEmpty(
        type: ContentType,
        now: Instant,
    ): Int

    fun updateContent(
        content: UpdateContent,
        now: Instant,
    )

    fun getById(id: Int): Content?

    fun getBySlug(slug: String): Content?

    fun getAll(
        limit: Int,
        offset: Int,
        type: ContentType? = null,
        query: String?,
        archived: Boolean = false,
        onlyPublished: Boolean = false,
        tag: String? = null,
        category: String? = null,
        from: LocalDate? = null,
        to: LocalDate? = null,
    ): List<ContentSummary>

    fun internalGetById(id: Int): Content?

    fun internalGetBySlug(slug: String): Content?

    fun internalGetAll(
        limit: Int,
        offset: Int,
        query: String?,
        archived: Boolean,
    ): List<ContentSummary>

    fun delete(id: Int): Boolean

    fun archive(
        id: Int,
        now: Instant,
    ): Boolean

    fun unarchive(
        id: Int,
        now: Instant,
    ): Boolean

    fun publish(
        id: Int,
        newState: ContentState,
        now: Instant,
    ): Boolean

    fun reject(
        id: Int,
        now: Instant,
    ): Boolean
}
