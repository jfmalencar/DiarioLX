package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.featured.FeaturedSection
import pt.ipl.diariolx.domain.featured.FeaturedSectionInput
import pt.ipl.diariolx.domain.featured.SectionPolicy
import pt.ipl.diariolx.domain.featured.SectionType
import pt.ipl.diariolx.repository.TransactionManager
import pt.ipl.diariolx.utils.FeaturedError
import pt.ipl.diariolx.utils.FeaturedSectionResult
import pt.ipl.diariolx.utils.failure
import pt.ipl.diariolx.utils.success

@Named
class FeaturedService(
    private val transactionManager: TransactionManager,
    private val sectionPolicy: SectionPolicy,
) {
    fun getHomepage(): List<FeaturedSection> =
        transactionManager.run { tx ->
            tx.featuredRepository.getHomepage()
        }

    fun saveHomepage(sections: List<FeaturedSectionInput>): FeaturedSectionResult =
        transactionManager.run { tx ->
            val seenSingletons = mutableSetOf<SectionType>()
            sections.forEach { section ->
                val type = section.type
                val rule = sectionPolicy.rule(type)
                if (rule.hasCategory && section.categoryId == null) {
                    return@run failure(FeaturedError.CategoryRequired)
                }
                if (!rule.hasCategory && section.categoryId != null) {
                    return@run failure(FeaturedError.CategoryNotAllowed)
                }
                if (section.contentIds.size > rule.maxArticles) {
                    return@run failure(
                        FeaturedError.TooManyArticles(type, rule.maxArticles, section.contentIds.size),
                    )
                }
                if (!rule.canBeAdded) {
                    if (!seenSingletons.add(type)) {
                        return@run failure(FeaturedError.DuplicateSingleton(type))
                    }
                }
            }
            val allIds = sections.flatMap { it.contentIds }.distinct()
            if (allIds.isNotEmpty()) {
                val published = tx.featuredRepository.findPublishedIds(allIds)
                val missing = allIds.firstOrNull { it !in published }
                if (missing != null) {
                    return@run failure(FeaturedError.ContentNotFound(missing))
                }
            }
            tx.featuredRepository.saveHomepage(sections)
            success(Unit)
        }
}
