package pt.ipl.diariolx.http.dto.content

import pt.ipl.diariolx.domain.content.ContentSummary

data class ContentSummaryResponseDTO(
    val id: Int,
    val title: String,
    val slug: String,
    val category: CategorySummaryResponseDTO,
    val tag: TagSummaryResponseDTO,
    val featuredImage: String?,
    val createdAt: String,
    val authors: List<String>,
    val isPublished: Boolean,
) {
    companion object {
        fun from(summary: ContentSummary): ContentSummaryResponseDTO {
            require(summary.slug != null) { "Slug is null." }
            require(summary.category != null) { "Category is null." }
            require(summary.tag != null) { "Tag is null." }
            return ContentSummaryResponseDTO(
                id = summary.id,
                title = summary.title,
                slug = summary.slug!!,
                category =
                    CategorySummaryResponseDTO(
                        summary.category!!.id,
                        summary.category!!.name,
                        summary.category!!.slug.value,
                    ),
                tag = TagSummaryResponseDTO(summary.tag!!.id, summary.tag!!.name, summary.tag!!.slug),
                featuredImage = summary.featuredImage,
                createdAt = summary.createdAt.toString(),
                authors = summary.authors,
                isPublished = true,
            )
        }
    }
}
