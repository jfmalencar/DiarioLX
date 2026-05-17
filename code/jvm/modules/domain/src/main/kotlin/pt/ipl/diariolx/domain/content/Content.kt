package pt.ipl.diariolx.domain.content

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.tag.TagSummary

data class Content(
    val id: Int,
    val title: String,
    val type: String,
    val slug: String,
    val headline: String,
    val featuredImage: MediaSummary?,
    val category: CategorySummary,
    val tags: List<TagSummary>,
    val authors: List<Author>,
    val blocks: List<ContentBlock>,
    val createdAt: Instant,
    val updatedAt: Instant,
    val publishedAt: Instant?,
    val archivedAt: Instant? = null,
)
