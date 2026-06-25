package pt.ipl.diariolx.http.dto.guest

import pt.ipl.diariolx.domain.featured.FeaturedSection
import pt.ipl.diariolx.http.dto.content.CategorySummaryResponseDTO
import pt.ipl.diariolx.http.dto.content.ContentSummaryResponseDTO

data class SectionDTO(
    val type: String,
    val category: CategorySummaryResponseDTO?,
    val contents: List<ContentSummaryResponseDTO>,
) {
    companion object {
        fun from(section: FeaturedSection) =
            SectionDTO(
                type = section.type.name,
                category = section.category?.let { CategorySummaryResponseDTO.from(it) },
                contents = section.contents.map { ContentSummaryResponseDTO.from(it) },
            )
    }
}
