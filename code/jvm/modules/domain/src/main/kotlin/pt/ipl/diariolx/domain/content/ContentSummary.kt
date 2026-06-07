package pt.ipl.diariolx.domain.content

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.tag.TagSummary

data class ContentSummary(
    val id: Int,
    val type: ContentType,
    val title: String,
    val category: CategorySummary?,
    val tag: TagSummary?,
    val state: ContentState,
    val slug: String?,
    val publishedAt: Instant?,
    val createdAt: Instant,
    val archivedAt: Instant?,
    val categoryId: Int?,
    val categoryName: String?,
    val featuredImage: String?,
    val authors: List<Author>,
)
