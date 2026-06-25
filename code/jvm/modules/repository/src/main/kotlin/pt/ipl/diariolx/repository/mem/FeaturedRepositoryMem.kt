package pt.ipl.diariolx.repository.mem

import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.category.value.Color
import pt.ipl.diariolx.domain.featured.FeaturedSection
import pt.ipl.diariolx.domain.featured.FeaturedSectionInput
import pt.ipl.diariolx.domain.shared.value.Slug
import pt.ipl.diariolx.repository.ContentRepository
import pt.ipl.diariolx.repository.FeaturedRepository

class FeaturedRepositoryMem(
    val contentRepository: ContentRepository,
) : FeaturedRepository {
    private val sections = mutableListOf<FeaturedSection>()
    private var currentId = 0

    override fun getHomepage(): List<FeaturedSection> = sections.sortedBy { it.position }

    override fun saveHomepage(sections: List<FeaturedSectionInput>) {
        this.sections.clear()
        currentId = 0

        sections
            .forEachIndexed { idx, input ->
                this.sections.add(
                    FeaturedSection(
                        id = ++currentId,
                        type = input.type,
                        category = input.categoryId?.let { CategorySummary(it, "", Slug(""), Color("")) },
                        position = idx,
                        contents = contentsById(input.contentIds),
                    ),
                )
            }
    }

    override fun findPublishedIds(ids: List<Int>): Set<Int> = contentsById(ids).filter { it.publishedAt != null }.map { it.id }.toSet()

    private fun contentsById(contentIds: List<Int>) =
        contentRepository.getAll(limit = 100, offset = 0, query = null).filter { it.id in contentIds }
}
