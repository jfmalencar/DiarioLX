package pt.ipl.diariolx.repository

import org.jdbi.v3.core.Handle
import org.jdbi.v3.core.kotlin.mapTo

class JdbiSettingsRepository(
    private val handle: Handle,
) : SettingsRepository {
    override fun getAll(): Map<String, String> =
        handle
            .createQuery("select key, value from settings")
            .mapTo<SettingRow>()
            .list()
            .associate { it.key to it.value }

    override fun upsert(
        key: String,
        value: String,
    ) {
        handle
            .createUpdate(
                """
                insert into settings (key, value) values (:key, :value)
                on conflict (key) do update set value = :value
                """.trimIndent(),
            ).bind("key", key)
            .bind("value", value)
            .execute()
    }

    override fun getFeaturedCategoryIds(): List<Int> =
        handle
            .createQuery("select category_id from navigation_featured_categories order by position")
            .mapTo<Int>()
            .list()

    override fun setFeaturedCategories(categoryIds: List<Int>) {
        handle.createUpdate("delete from navigation_featured_categories").execute()
        categoryIds.forEachIndexed { index, id ->
            handle
                .createUpdate(
                    "insert into navigation_featured_categories (category_id, position) values (:category_id, :position)",
                ).bind("category_id", id)
                .bind("position", index)
                .execute()
        }
    }

    private data class SettingRow(
        val key: String,
        val value: String,
    )
}
