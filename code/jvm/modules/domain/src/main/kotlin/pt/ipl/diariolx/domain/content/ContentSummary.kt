package pt.ipl.diariolx.domain.content

data class ContentSummary(
    val id: Int,
    val title: String,
    val slug: String,
    val category: String,
    val featuredImage: String?,
    val createdAt: String,
    val authors: List<String>,
    val isPublished: Boolean,
)
