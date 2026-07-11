package pt.ipl.diariolx.repository

interface SettingsRepository {
    fun getAll(): Map<String, String>

    fun upsert(
        key: String,
        value: String,
    )

    fun getFeaturedCategoryIds(): List<Int>

    fun setFeaturedCategories(categoryIds: List<Int>)
}
