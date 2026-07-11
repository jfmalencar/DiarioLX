package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.category.Category
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.settings.NavSection
import pt.ipl.diariolx.domain.settings.NavigationView
import pt.ipl.diariolx.domain.settings.SettingsView
import pt.ipl.diariolx.repository.TransactionManager

@Named
class SettingsService(
    private val transactionManager: TransactionManager,
) {
    fun getAll(): Map<String, String> = transactionManager.run { it.settingsRepository.getAll() }

    fun getSettings(): SettingsView =
        transactionManager.run { tx ->
            val values = tx.settingsRepository.getAll()
            val slugs =
                tx.settingsRepository
                    .getFeaturedCategoryIds()
                    .mapNotNull { id ->
                        tx.categoryRepository
                            .getById(id)
                            ?.slug
                            ?.value
                    }
            SettingsView(values, slugs)
        }

    fun update(
        values: Map<String, String>,
        featuredCategorySlugs: List<String>,
    ) = transactionManager.run { tx ->
        values.forEach { (key, value) -> tx.settingsRepository.upsert(key, value) }
        val allCategories =
            tx.categoryRepository.getAll(limit = 1000, offset = 0, query = null, archived = false)
        val featuredIds =
            featuredCategorySlugs
                .mapNotNull { slug -> allCategories.find { it.slug.value == slug }?.id }
                .distinct()
        tx.settingsRepository.setFeaturedCategories(featuredIds)
    }

    fun getNavigation(): NavigationView =
        transactionManager.run { tx ->
            val settings = tx.settingsRepository.getAll()

            val allCategories =
                tx.categoryRepository.getAll(limit = 1000, offset = 0, query = null, archived = false)
            val categoriesById = allCategories.associateBy { it.id }
            val featured = tx.settingsRepository.getFeaturedCategoryIds().mapNotNull { categoriesById[it] }
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
