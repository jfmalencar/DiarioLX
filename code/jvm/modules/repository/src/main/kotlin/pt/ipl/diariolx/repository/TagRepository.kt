package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.tag.NewTag
import pt.ipl.diariolx.domain.tag.Tag
import pt.ipl.diariolx.domain.tag.UpdateTag

interface TagRepository {
    fun create(tag: NewTag): Int

    fun getById(id: Int): Tag?

    fun getBySlug(slug: String): Tag?

    fun getAll(
        page: Int,
        limit: Int,
        query: String?,
        archived: Boolean,
    ): List<Tag>

    fun delete(id: Int): Boolean

    fun update(tag: UpdateTag): Boolean

    fun archive(id: Int): Boolean

    fun unarchive(id: Int): Boolean
}
