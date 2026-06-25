package pt.ipl.diariolx.repository

import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.domain.tag.Tag
import pt.ipl.diariolx.domain.tag.TagUpdate

interface TagRepository {
    fun create(
        name: String,
        slug: Slug,
        description: String? = null,
    ): Int

    fun getById(id: Int): Tag?

    fun getBySlug(slug: Slug): Tag?

    fun getAll(
        limit: Int,
        offset: Int,
        query: String?,
        archived: Boolean,
    ): List<Tag>

    fun delete(id: Int): Boolean

    fun hasContents(id: Int): Boolean

    fun update(tag: TagUpdate): Boolean

    fun archive(id: Int): Boolean

    fun unarchive(id: Int): Boolean
}
