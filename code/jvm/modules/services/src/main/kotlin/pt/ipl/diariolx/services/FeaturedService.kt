package pt.ipl.diariolx.services

import jakarta.inject.Named
import pt.ipl.diariolx.domain.featured.FeaturedSection
import pt.ipl.diariolx.domain.featured.FeaturedSectionInput
import pt.ipl.diariolx.domain.featured.SectionPolicy
import pt.ipl.diariolx.domain.featured.SectionViolation
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
            sectionPolicy.validate(sections)?.let { return@run failure(it.toFeaturedError()) }

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

    private fun SectionViolation.toFeaturedError(): FeaturedError =
        when (this) {
            is SectionViolation.CategoryRequired -> FeaturedError.CategoryRequired
            is SectionViolation.CategoryNotAllowed -> FeaturedError.CategoryNotAllowed
            is SectionViolation.TooManyArticles -> FeaturedError.TooManyArticles(type, max, got)
            is SectionViolation.DuplicateSingleton -> FeaturedError.DuplicateSingleton(type)
        }
}
