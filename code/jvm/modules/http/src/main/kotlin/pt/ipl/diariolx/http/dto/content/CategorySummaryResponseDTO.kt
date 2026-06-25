package pt.ipl.diariolx.http.dto.content

import pt.ipl.diariolx.domain.category.CategorySummary

data class CategorySummaryResponseDTO(
    val id: Int,
    val name: String,
    val slug: String,
    val color: String,
) {
    companion object {
        fun from(category: CategorySummary) =
            CategorySummaryResponseDTO(
                category.id,
                category.name,
                category.slug.value,
                category.color.value,
            )
    }
}
