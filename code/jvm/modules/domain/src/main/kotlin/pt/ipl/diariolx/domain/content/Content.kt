package pt.ipl.diariolx.domain.content

import kotlinx.datetime.Instant
import pt.ipl.diariolx.domain.author.Author
import pt.ipl.diariolx.domain.category.CategorySummary
import pt.ipl.diariolx.domain.content.value.ContentBlock
import pt.ipl.diariolx.domain.content.value.ContentParent
import pt.ipl.diariolx.domain.media.MediaSummary
import pt.ipl.diariolx.domain.tag.TagSummary

private const val MIN_PHOTO_ESSAY_IMAGES = 3

data class Content(
    val id: Int,
    val type: ContentType,
    val title: String,
    val headline: String,
    val featuredImage: MediaSummary?,
    val slug: String? = null,
    val category: CategorySummary? = null,
    val parentId: Int? = null,
    val parent: ContentParent? = null,
    val embedUrl: String? = null,
    val publishedAt: Instant? = null,
    val archivedAt: Instant? = null,
    val createdAt: Instant,
    val updatedAt: Instant,
    val state: ContentState,
    val tags: List<TagSummary>,
    val authors: List<Author>,
    val blocks: List<ContentBlock>,
) {
    fun missingPublicationFields(): List<ContentField> =
        buildList {
            if (title.isBlank()) add(ContentField.TITLE)
            if (headline.isBlank()) add(ContentField.HEADLINE)
            if (slug == null) add(ContentField.SLUG)
            if (type == ContentType.EPISODE) {
                if (parentId == null) add(ContentField.PARENT)
            } else if (category == null) {
                add(ContentField.CATEGORY)
            }
            if (tags.isEmpty()) add(ContentField.TAG)
            val canEmbed = type == ContentType.VIDEO || type == ContentType.EPISODE
            if (featuredImage == null && !(canEmbed && embedUrl != null)) add(ContentField.FEATURED_IMAGE)
            if (type == ContentType.PHOTO_ESSAY) {
                val photoCount = blocks.filter { it.type == "GALLERY" }.sumOf { it.images.size }
                if (photoCount < MIN_PHOTO_ESSAY_IMAGES) add(ContentField.PHOTOS)
            }
        }
}
