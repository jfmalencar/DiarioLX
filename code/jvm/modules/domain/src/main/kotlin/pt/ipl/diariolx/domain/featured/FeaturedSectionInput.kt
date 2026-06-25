package pt.ipl.diariolx.domain.featured

data class FeaturedSectionInput(
    val type: SectionType,
    val categoryId: Int?,
    val contentIds: List<Int>,
)
