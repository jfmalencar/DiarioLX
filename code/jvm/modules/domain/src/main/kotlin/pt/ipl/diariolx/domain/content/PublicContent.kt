package pt.ipl.diariolx.domain.content

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.content.value.ContentBlock
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.tag.TagSummary

data class PublicContent(
    val id: Int,
    val type: ContentType,
    val title: String,
    val headline: String,
    val featuredImage: MediaSummary,
    val slug: String,
    val category: CategorySummary,
    val publishedAt: Instant? = null,
    val archivedAt: Instant? = null,
    val createdAt: Instant,
    val updatedAt: Instant,
    val tags: List<TagSummary>,
    val authors: List<Author>,
    val blocks: List<ContentBlock>,
)
