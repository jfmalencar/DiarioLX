package pt.ipl.diariolx.http.dto.content

import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.content.Content
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.ContentType
import pt.ipl.diariolx.domain.content.value.ContentBlock
import pt.ipl.diariolx.domain.content.value.ContentParent
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.tag.TagSummary

data class ContentResponseDTO(
    val id: Int,
    val title: String,
    val slug: String?,
    val state: ContentState,
    val type: ContentType,
    val headline: String,
    val featuredImage: MediaSummary?,
    val category: CategorySummary?,
    val parentId: Int?,
    val parent: ContentParent?,
    val embedUrl: String?,
    val tags: List<TagSummary>,
    val authors: List<Author>,
    val blocks: List<ContentBlock>,
    val createdAt: String,
    val publishedAt: String?,
    val updatedAt: String,
) {
    companion object {
        fun from(content: Content): ContentResponseDTO =
            ContentResponseDTO(
                id = content.id,
                title = content.title,
                type = content.type,
                slug = content.slug,
                headline = content.headline,
                featuredImage = content.featuredImage,
                category = content.category,
                parentId = content.parentId,
                parent = content.parent,
                embedUrl = content.embedUrl,
                tags = content.tags,
                authors = content.authors,
                blocks = content.blocks,
                createdAt = content.createdAt.toString(),
                publishedAt = content.publishedAt?.toString(),
                updatedAt = content.updatedAt.toString(),
                state = content.state,
            )
    }
}
