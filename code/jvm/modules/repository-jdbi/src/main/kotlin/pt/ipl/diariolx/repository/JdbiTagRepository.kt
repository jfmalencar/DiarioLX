package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import pt.ipl.diariolx.domain.tag.NewTag
import pt.ipl.diariolx.domain.tag.Tag
import pt.ipl.diariolx.domain.tag.UpdateTag

class JdbiTagRepository(
    private val handle: Handle,
) : TagRepository {
    override fun create(tag: NewTag): Int =
        handle
            .createQuery(
                """
                insert into tags (name, slug, description)
                values (:name, :slug, :description)
                returning id
                """.trimIndent(),
            ).bind("name", tag.name)
            .bind("slug", tag.slug)
            .bind("description", tag.description)
            .mapTo<Int>()
            .one()

    override fun update(tag: UpdateTag) =
        handle
            .createUpdate(
                """
                update tags
                set name = :name, slug = :slug, description = :description
                where id = :id
                """.trimIndent(),
            ).bind("id", tag.id)
            .bind("name", tag.name)
            .bind("slug", tag.slug)
            .bind("description", tag.description)
            .execute() > 0

    override fun getAll(
        page: Int,
        limit: Int,
        query: String?,
        archived: Boolean,
    ): List<Tag> {
        val sql =
            buildString {
                append("select * from v_tags WHERE 1 = 1".trimIndent())
                when (archived) {
                    true -> append(" AND archived_at IS NOT NULL")
                    false -> append(" AND archived_at IS NULL")
                }
                if (query != null) {
                    append(" AND (name ILIKE :query OR slug ILIKE :query)")
                }
                append(" ORDER BY id desc")
                append(" LIMIT :limit OFFSET :offset")
            }
        return handle
            .createQuery(sql)
            .bind("limit", limit)
            .bind("offset", (page - 1) * limit)
            .bind("query", "%$query%")
            .mapTo<TagModel>()
            .list()
            .map { it.tag }
    }

    override fun delete(id: Int): Boolean =
        handle
            .createUpdate("delete from categories where id = :id ")
            .bind("id", id)
            .execute() > 0

    override fun getById(id: Int): Tag? =
        handle
            .createQuery("select * from v_tags where id = :id ")
            .bind("id", id)
            .mapTo<TagModel>()
            .singleOrNull()
            ?.tag

    override fun getBySlug(slug: String): Tag? =
        handle
            .createQuery("select * from v_tags where slug = :slug")
            .bind("slug", slug)
            .mapTo<TagModel>()
            .singleOrNull()
            ?.tag

    override fun archive(id: Int): Boolean =
        handle
            .createUpdate(
                """
                update tags
                set archived_at = EXTRACT(EPOCH FROM NOW()), updated_at = EXTRACT(EPOCH FROM NOW())
                where id = :id
            """,
            ).bind("id", id)
            .execute() > 0

    override fun unarchive(id: Int): Boolean =
        handle
            .createUpdate(
                """
                update tags
                set archived_at = null, updated_at = EXTRACT(EPOCH FROM NOW())
                where id = :id
            """,
            ).bind("id", id)
            .execute() > 0

    private data class TagModel(
        val id: Int,
        val name: String,
        val description: String?,
        val slug: String,
        val quantity: Int,
        val createdAt: Long,
        val updatedAt: Long,
        val archivedAt: Long?,
    ) {
        val tag: Tag
            get() =
                Tag(
                    id = id,
                    name = name,
                    description = description,
                    slug = slug,
                    quantity = quantity,
                    createdAt = Instant.fromEpochSeconds(createdAt),
                    updatedAt = Instant.fromEpochSeconds(updatedAt),
                    archivedAt = archivedAt?.let { Instant.fromEpochSeconds(it) },
                )
    }
}
