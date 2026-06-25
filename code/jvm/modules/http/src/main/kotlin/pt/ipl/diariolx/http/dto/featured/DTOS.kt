package pt.ipl.diariolx.http.dto.featured

import pt.ipl.diariolx.domain.featured.FeaturedSection
import pt.ipl.diariolx.domain.featured.FeaturedSectionInput
import pt.ipl.diariolx.domain.featured.SectionType
import pt.ipl.diariolx.http.dto.content.CategorySummaryResponseDTO
import pt.ipl.diariolx.http.dto.content.ContentSummaryResponseDTO

data class FeaturedSectionResponseDTO(
    val id: Int,
    val type: SectionType,
    val category: CategorySummaryResponseDTO?,
    val position: Int,
    val contents: List<ContentSummaryResponseDTO>,
) {
    companion object {
        fun from(section: FeaturedSection) =
            FeaturedSectionResponseDTO(
                id = section.id,
                type = section.type,
                category = section.category?.let { CategorySummaryResponseDTO.from(it) },
                position = section.position,
                contents = section.contents.map { ContentSummaryResponseDTO.from(it) },
            )
    }
}

data class BackofficeHomepageResponseDTO(
    val sections: List<FeaturedSectionResponseDTO>,
) {
    companion object {
        fun from(sections: List<FeaturedSection>) = BackofficeHomepageResponseDTO(sections.map { FeaturedSectionResponseDTO.from(it) })
    }
}

data class FeaturedSectionRequestDTO(
    val type: SectionType,
    val categoryId: Int?,
    val contentIds: List<Int>,
) {
    fun toInput() = FeaturedSectionInput(type, categoryId, contentIds)
}

data class SaveHomepageRequestDTO(
    val sections: List<FeaturedSectionRequestDTO>,
) {
    fun toInputs() = sections.map { it.toInput() }
}
