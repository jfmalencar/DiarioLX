package pt.ipl.diariolx.http.model

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.article.ArticleBlock
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.tag.TagSummary

data class ArticleResponse(
    val id: Int,
    val title: String,
    val slug: String,
    val headline: String,
    val featuredImage: MediaSummary?,
    val category: CategorySummary,
    val tags: List<TagSummary>,
    val authors: List<Author>,
    val blocks: List<ArticleBlock>,
    val createdAt: String,
) {
    companion object {
        fun from(article: pt.ipl.diariolx.domain.article.Article): ArticleResponse =
            ArticleResponse(
                id = article.id,
                title = article.title,
                slug = article.slug,
                headline = article.headline,
                featuredImage = article.featuredImage,
                category = article.category,
                tags = article.tags,
                authors = article.authors,
                blocks = article.blocks,
                createdAt = article.createdAt.toString(),
            )
    }
}
