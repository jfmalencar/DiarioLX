package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.NewContent

interface ContentRepository {
    fun create(content: NewContent): Int

    fun getById(id: Int): Content?

    fun getBySlug(slug: String): Content?

    fun getAll(
        limit: Int,
        offset: Int,
        query: String?,
        archived: Boolean,
    ): List<ContentSummary>

    fun delete(id: Int): Boolean

    fun archive(id: Int): Boolean

    fun unarchive(id: Int): Boolean
}
