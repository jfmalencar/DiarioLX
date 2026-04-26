package pt.ipl.diariolx.domain.article

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.tag.TagSummary

data class Article(
    val id: Int,
    val title: String,
    val slug: String,
    val headline: String,
    val featuredImage: MediaSummary?,
    val category: CategorySummary,
    val tags: List<TagSummary>,
    val authors: List<Author>,
    val blocks: List<ArticleBlock>,
    val createdAt: Instant,
    val updatedAt: Instant,
    val publishedAt: Instant?,
    val archivedAt: Instant? = null,
)
