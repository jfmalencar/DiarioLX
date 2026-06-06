package pt.ipl.diariolx.domain.content

import kotlinx.datetime.Instant

data class ContentSummary(
    val id: Int,
    val type: ContentType,
    val title: String,
    val state: ContentState,
    val slug: String?,
    val createdAt: Instant,
    val archivedAt: Instant,
    val categoryId: Int?,
    val categoryName: String?,
    val featuredImage: String?,
    val authors: List<String>,
)
