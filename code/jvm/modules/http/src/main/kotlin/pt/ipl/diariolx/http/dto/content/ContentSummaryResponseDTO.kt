package pt.ipl.diariolx.http.dto.content

import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentSummary
import pt.ipl.diariolx.domain.content.ContentType

data class ContentSummaryResponseDTO(
    val id: Int,
    val type: ContentType,
    val title: String?,
    val slug: String?,
    val state: ContentState,
    val category: CategorySummaryResponseDTO?,
    val tag: TagSummaryResponseDTO?,
    val featuredImage: String?,
    val authors: List<Author>,
    val publishedAt: String? = null,
    val archivedAt: String? = null,
    val createdAt: String,
) {
    companion object {
        fun from(summary: ContentSummary): ContentSummaryResponseDTO =
            ContentSummaryResponseDTO(
                id = summary.id,
                title = summary.title,
                slug = summary.slug,
                category =
                    summary.category?.let {
                        CategorySummaryResponseDTO(
                            it.id,
                            it.name,
                            it.slug.value,
                        )
                    },
                tag = summary.tag?.let { TagSummaryResponseDTO(it.id, it.name, it.slug) },
                featuredImage = summary.featuredImage,
                authors = summary.authors,
                type = summary.type,
                state = summary.state,
                publishedAt = summary.publishedAt?.toString(),
                archivedAt = summary.archivedAt?.toString(),
                createdAt = summary.createdAt.toString(),
            )
    }
}
