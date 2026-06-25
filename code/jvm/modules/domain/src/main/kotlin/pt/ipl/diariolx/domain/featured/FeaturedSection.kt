package pt.ipl.diariolx.domain.featured

import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.content.ContentSummary

data class FeaturedSection(
    val id: Int,
    val type: SectionType,
    val category: CategorySummary?,
    val position: Int,
    val contents: List<ContentSummary>,
)
