package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.settings.NavSection
import pt.ipl.diariolx.domain.settings.NavigationView
import pt.ipl.diariolx.repository.TransactionManager

@Named
class SettingsService(
    private val transactionManager: TransactionManager,
) {
    fun getAll(): Map<String, String> = transactionManager.run { it.settingsRepository.getAll() }

    fun update(values: Map<String, String>) =
        transactionManager.run { tx ->
            values.forEach { (key, value) -> tx.settingsRepository.upsert(key, value) }
        }

    fun getNavigation(): NavigationView =
        transactionManager.run { tx ->
            val settings = tx.settingsRepository.getAll()
            val featuredSlugs =
                settings["nav.featuredCategories"]
                    .orEmpty()
                    .split(",")
                    .map { it.trim() }
                    .filter { it.isNotEmpty() }

            val allCategories =
                tx.categoryRepository.getAll(limit = 1000, offset = 0, query = null, archived = false)
            val featured = featuredSlugs.mapNotNull { slug -> allCategories.find { it.slug.value == slug } }
            val featuredIds = featured.map { it.id }.toSet()
            val sections =
                allCategories
                    .filter { it.parentId == 0 && it.id !in featuredIds }
                    .map { parent ->
                        NavSection(
                            parent.toSummary(),
                            allCategories.filter { it.parentId == parent.id }.map { it.toSummary() },
                        )
                    }

            NavigationView(
                featured = featured.map { it.toSummary() },
                sections = sections,
                showPhotos = settings["nav.showPhotos"].parseBool(),
                showPodcasts = settings["nav.showPodcasts"].parseBool(),
                showVideos = settings["nav.showVideos"].parseBool(),
            )
        }

    private fun Category.toSummary() = CategorySummary(id, name, slug, color)

    private fun String?.parseBool(): Boolean = this == "true"
}
