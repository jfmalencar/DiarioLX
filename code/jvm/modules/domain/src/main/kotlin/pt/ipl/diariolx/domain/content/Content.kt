package pt.ipl.diariolx.domain.content

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.content.value.ContentBlock
import pt.ipl.diariolx.domain.content.value.ContentParent
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.tag.TagSummary

data class Content(
    val id: Int,
    val type: ContentType,
    val title: String,
    val headline: String,
    val featuredImage: MediaSummary?,
    val slug: String? = null,
    val category: CategorySummary? = null,
    // Episodes reference their Podcast; null for every other content type.
    val parentId: Int? = null,
    val parent: ContentParent? = null,
    // External embed (YouTube for VIDEO, Spotify for EPISODE) in place of an uploaded file.
    val embedUrl: String? = null,
    val publishedAt: Instant? = null,
    val archivedAt: Instant? = null,
    val createdAt: Instant,
    val updatedAt: Instant,
    val state: ContentState,
    val tags: List<TagSummary>,
    val authors: List<Author>,
    val blocks: List<ContentBlock>,
)
