package pt.ipl.diariolx.repository

import kotlinx.datetime.Instant
import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo
import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.domain.category.NewCategory
import pt.ipl.diariolx.domain.category.UpdateCategory

class JdbiCategoryRepository(
    private val handle: Handle,
) : CategoryRepository {
    override fun create(category: NewCategory): Int =
        handle
            .createQuery(
                """
                insert into categories (name, slug, description, color, parent_id)
                values (:name, :slug, :description, :color, :parent_id)
                returning id
                """.trimIndent(),
            ).bind("name", category.name)
            .bind("slug", category.slug)
            .bind("description", category.description)
            .bind("color", category.color)
            .bind("parent_id", category.parentId)
            .mapTo<Int>()
            .one()

    override fun update(category: UpdateCategory): Boolean =
        handle
            .createUpdate(
                """
                update categories
                set name = :name, slug = :slug, description = :description,
                color = :color, parent_id = :parent_id, updated_at = EXTRACT(EPOCH FROM NOW())
                where id = :id
                """.trimIndent(),
            ).bind("id", category.id)
            .bind("name", category.name)
            .bind("slug", category.slug)
            .bind("description", category.description)
            .bind("color", category.color)
            .bind("parent_id", category.parentId)
            .execute() > 0

    override fun getAll(
        page: Int,
        limit: Int,
        query: String?,
        archived: Boolean,
    ): List<Category> {
        val sql =
            buildString {
                append("select * from v_categories WHERE 1 = 1".trimIndent())
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
            .mapTo<CategoryModel>()
            .list()
            .map { it.category }
    }

    override fun delete(id: Int): Boolean =
        handle
            .createUpdate("delete from categories where id = :id ")
            .bind("id", id)
            .execute() > 0

    override fun getById(id: Int): Category? =
        handle
            .createQuery("select * from v_categories where id = :id ")
            .bind("id", id)
            .mapTo<CategoryModel>()
            .singleOrNull()
            ?.category

    override fun getBySlug(slug: String): Category? =
        handle
            .createQuery("select * from v_categories where slug = :slug")
            .bind("slug", slug)
            .mapTo<CategoryModel>()
            .singleOrNull()
            ?.category

    override fun archive(id: Int): Boolean =
        handle
            .createUpdate(
                """
                update categories
                set archived_at = EXTRACT(EPOCH FROM NOW()), updated_at = EXTRACT(EPOCH FROM NOW())
                where id = :id
            """,
            ).bind("id", id)
            .execute() > 0

    override fun unarchive(id: Int): Boolean =
        handle
            .createUpdate(
                """
                update categories
                set archived_at = null, updated_at = EXTRACT(EPOCH FROM NOW())
                where id = :id
            """,
            ).bind("id", id)
            .execute() > 0

    private data class CategoryModel(
        val id: Int,
        val name: String,
        val description: String?,
        val slug: String,
        val color: String,
        val parentId: Int,
        val parentName: String?,
        val quantity: Int,
        val createdAt: Long,
        val updatedAt: Long,
        val archivedAt: Long?,
    ) {
        val category: Category
            get() =
                Category(
                    id = id,
                    name = name,
                    description = description,
                    color = color,
                    slug = slug,
                    parentId = parentId,
                    parentName = parentName,
                    quantity = quantity,
                    createdAt = Instant.fromEpochSeconds(createdAt),
                    updatedAt = Instant.fromEpochSeconds(updatedAt),
                    archivedAt = archivedAt?.let { Instant.fromEpochSeconds(it) },
                )
    }
}
