package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.tag.Tag
import pt.ipl.diariolx.domain.tag.UpdateTag

interface TagRepository {
    fun create(
        name: String,
        slug: String,
        description: String? = null,
    ): Int

    fun getById(id: Int): Tag?

    fun getBySlug(slug: String): Tag?

    fun getAll(
        limit: Int,
        offset: Int,
        query: String?,
        archived: Boolean,
    ): List<Tag>

    fun delete(id: Int): Boolean

    fun update(tag: UpdateTag): Boolean

    fun archive(id: Int): Boolean

    fun unarchive(id: Int): Boolean
}
