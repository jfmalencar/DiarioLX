package pt.ipl.diariolx.http.dto.content

import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.content.value.ContentBlock
import pt.ipl.diariolx.domain.tag.TagSummary
import pt.ipl.diariolx.http.dto.media.MediaResponseDTO

data class ContentPublicResponseDTO(
    val id: Int,
    val title: String,
    val slug: String,
    val type: ContentType,
    val headline: String,
    val featuredImage: MediaResponseDTO?,
    val category: CategorySummary,
    val tags: List<TagSummary>,
    val authors: List<Author>,
    val blocks: List<ContentBlock>,
    val publishedAt: String,
) {
    companion object {
        fun from(content: Content): ContentPublicResponseDTO =
            ContentPublicResponseDTO(
                id = content.id,
                title = content.title,
                type = content.type,
                slug = content.slug ?: error("missing slug"),
                headline = content.headline,
                featuredImage = null,
                category = content.category ?: error("missing category"),
                tags = content.tags,
                authors = content.authors,
                blocks = content.blocks,
                publishedAt = content.publishedAt?.toString() ?: error("not published"),
            )
    }
}
